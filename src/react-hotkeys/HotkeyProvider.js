import React, { Component } from 'react';

// Context
import Context from './HotkeyContext';

class HotkeyProvider extends Component {
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
    this.state = {
      handlers: {}
    };
    // To be able to register multiple handlers on mounts
    this.handlers = {};
  }

  // As the register and remove handlers does not update,
  // but must be provided to consumer
  shouldComponentUpdate (nextProps, nextState) {
    if (
      this.props.children !== nextProps.children ||
      this.state.handlers !== nextState.handlers
    ) {
      return true;
    }
    return false;
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
    // Order is important here when we register! Ex: 'ctrl+alt+84'
    if (e.altKey) keyHash = 'alt+' + keyHash;
    if (e.ctrlKey || e.metaKey) keyHash = 'ctrl+' + keyHash;
    const hasHandler = this.state.handlers[keyHash];
    // TODO: Priority/override functionality?
    if (hasHandler && hasHandler[0]) {
      hasHandler[0](e);
      if (this.props.debug) console.log('Called handler:', keyHash);
    }
  }

  // Register handler
  registerHandler (keycode, handler) {
    if (this.props.debug) console.log('Registered handler:', keycode);
    const q = this.handlers[keycode] || [];
    q.unshift(handler);
    this.handlers[keycode] = q;
    this.setState({
      handlers: this.handlers
    });
  };

  // Remove handler
  removeHandler (keycode, handler) {
    if (this.props.debug) console.log('Removed handler:', keycode);
    let q = this.handlers[keycode];
    if (q) {
      q = q.filter(h => h !== handler);
      this.handlers[keycode] = q.length > 0 ? q : undefined;
      this.setState({
        handlers: this.handlers
      });
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
