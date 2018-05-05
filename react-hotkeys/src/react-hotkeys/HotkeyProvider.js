import React, { Component } from 'react';

// Context
import Context from './HotkeyContext';

class HotkeyProvider extends Component {

  constructor (props) {
    super(props);
    this.registerHandler = this.registerHandler.bind(this);
    this.removeHandler = this.removeHandler.bind(this);
    this.globalHandler = this.globalHandler.bind(this);
    this.state = {
      registerHandler: this.registerHandler,
      removeHandler: this.removeHandler,
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
    const hasHandler = this.state.handlers[e.keyCode];
    // TODO: Priority/override functionality?
    if (hasHandler && hasHandler[0]) {
      hasHandler[0](e);
    }
  }

  // Register handler
  registerHandler (keycode, handler) {
    const q = this.handlers[keycode] || [];
    q.unshift(handler);
    this.handlers = {
      ...this.handlers,
      [keycode]: q
    };
    this.setState({
      handlers: this.handlers
    })
  };

  // Remove handler
  removeHandler (keycode, handler) {
    let q = this.handlers[keycode];
    if (q) {
      q = q.filter(h => h !== handler);
      this.handlers = {
        ...this.handlers,
        [keycode]: q.length > 0 ? q : undefined
      };
      this.setState({
        handlers: this.handlers
      });
    }
  }

  render () {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
        {this.props.debug && (
          <div className="center measure">
            <h5>Active keycodes</h5>
            <pre className="f7">{JSON.stringify(this.state.handlers, null, 2) }</pre>
          </div>
        )}
      </Context.Provider>
    )
  }
}

export default HotkeyProvider;
