import React, { Fragment, Component } from 'react';

// Context
import Context from './HotkeyContext';

/*
* Handles how hotkeys are registered and removed in the context.
*/
class HotkeyHandler extends Component {
  constructor (props) {
    super(props);
    // Create a reference
    this.keyCode = props.keyCode;
    this.handler = props.handler;
  }
  shouldComponentUpdate () {
    return false;
  }
  componentDidMount () {
    this.props.registerHandler(this.props.keyCode, this.handler);
  }
  componentWillUnmount () {
    this.props.removeHandler(this.props.keyCode, this.handler);
  }
  render() {
    return null;
  }
}

// HOC for simplicity
function withHotkey(C) {
  return function HotkeyHelper ({ keyCode, handler, ...restProps}) {
    return (
      <Context.Consumer>
        {({ registerHandler, removeHandler }) => {
          return (
            <Fragment>
              <HotkeyHandler keyCode={keyCode} handler={handler} registerHandler={registerHandler} removeHandler={removeHandler} />
              <C {...restProps} />
            </Fragment>
          );
        }}
      </Context.Consumer>
    );
  }
}
export default withHotkey;
