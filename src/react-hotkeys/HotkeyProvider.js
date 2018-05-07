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
    this.handlers = {};
  }

  // Add and remove listener
  componentDidMount () {
    window.addEventListener('keydown', this.globalHandler)
  }
  componentWillUnmountMount () {
    window.removeEventListener('keydown', this.globalHandler)
  }

  globalHandler (e) {
    let keyHash = e.keyCode;
    // Order is important here when we register! Ex: 'ctrl+alt+t'
    if (e.altKey) keyHash = 'alt+' + keyHash;
    if (e.ctrlKey || e.metaKey) keyHash = 'ctrl+' + keyHash;
    const hasHandler = this.handlers[keyHash];
    // TODO: Priority/override functionality?
    if (hasHandler && hasHandler[0]) {
      e.preventDefault();
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
  registerHandler (keyhash, handler) {
    const keycode = this.convertHashToKeys(keyhash);
    // Add to queue of handlers for keyHash
    const q = this.handlers[keycode] || [];
    q.unshift(handler);
    this.handlers[keycode] = q;
    if (this.props.debug) console.log('Registered handler:', keycode);
  };

  // Remove handler
  removeHandler (keyhash, handler) {
    const keycode = this.convertHashToKeys(keyhash);
    let q = this.handlers[keycode];
    if (q) {
      q = q.filter(h => h !== handler);
      this.handlers[keycode] = q.length > 0 ? q : undefined;
      if (this.props.debug) console.log('Removed handler:', keycode);
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
