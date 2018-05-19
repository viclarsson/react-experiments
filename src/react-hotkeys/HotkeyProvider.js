import React, { PureComponent } from 'react';

// Context
import Context from './HotkeyContext';

// Lookup table
import KeyCodes from './KeyCodes';

class HotkeyProvider extends PureComponent {
  constructor (props) {
    super(props);
    this.registerHandler = this.registerHandler.bind(this);
    this.removeHandler = this.removeHandler.bind(this);
    this.globalHandler = this.globalHandler.bind(this);
    // To prevent new object for context
    this.contextData = {
      registerHandler: this.registerHandler,
      removeHandler: this.removeHandler,
    };
    // Register handlers
    this.keyDownHandlers = {};
    this.keyUpHandlers = {};
  }

  // Add and remove listener
  componentDidMount () {
    window.addEventListener('keydown', this.globalHandler)
    window.addEventListener('keyup', this.globalHandler)
  }
  componentWillUnmountMount () {
    window.removeEventListener('keydown', this.globalHandler)
    window.removeEventListener('keyup', this.globalHandler)
  }

  globalHandler (e) {
    const type = e.type;
    let keyCode = e.keyCode;
    let keyHash = keyCode;
    // Order is important here when we register! Ex: 'ctrl+alt+t'
    if (e.altKey && keyCode !== 18) keyHash = 'alt+' + keyHash;
    if ((e.ctrlKey) && keyCode !== 17) keyHash = 'ctrl+' + keyHash;
    if ((e.metaKey) && keyCode !== 91) keyHash = 'cmd+' + keyHash;
    const hasHandler = type === 'keydown' ? this.keyDownHandlers[keyHash] : this.keyUpHandlers[keyHash];
    // TODO: Priority/override functionality?
    if (hasHandler && hasHandler[0]) {
      hasHandler[0](e);
      if (this.props.debug) console.log('Called handler:', keyHash);
    }
  }
  // Translate to keycodes
  convertHashToKeys(keyhash) {
    const keys = keyhash.split('+');
    const key = KeyCodes[keys.pop()];
    if (!key) {
      console.error('Unknown hotkey:', keyhash);
      return;
    }
    // Rebuild keyHash
    return [...keys, key].join('+');
  }

  // Register handler
  registerHandler (keyhash, handler, keyUpHandler) {
    const keycode = this.convertHashToKeys(keyhash);

    if (handler) {
      // Add to queue of handlers for keyHash
      const q = this.keyDownHandlers[keycode] || [];
      q.unshift(handler);
      this.keyDownHandlers[keycode] = q;
      if (this.props.debug) console.log('Registered handler:', keycode);
    }

    // Add to queue of handlers for keyHash in keyUp
    if (keyUpHandler) {
      const keyUpQ = this.keyUpHandlers[keycode] || [];
      keyUpQ.unshift(keyUpHandler);
      this.keyUpHandlers[keycode] = keyUpQ;
      if (this.props.debug) console.log('Registered keyup handler:', keycode);
    }
  };

  // Remove handler
  removeHandler (keyhash, handler, keyUpHandler) {
    const keycode = this.convertHashToKeys(keyhash);
    let q = this.keyDownHandlers[keycode];
    let keyUpQ = this.keyUpHandlers[keycode];
    if (q) {
      q = q.filter(h => h !== handler);
      this.keyDownHandlers[keycode] = q.length > 0 ? q : undefined;
      if (this.props.debug) console.log('Removed handler:', keycode);
    }
    if (keyUpQ) {
      keyUpQ = keyUpQ.filter(h => h !== keyUpHandler);
      this.keyUpHandlers[keycode] = keyUpQ.length > 0 ? keyUpQ : undefined;
    }
  }

  render () {
    return (
      <Context.Provider value={this.contextData}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export default HotkeyProvider;
