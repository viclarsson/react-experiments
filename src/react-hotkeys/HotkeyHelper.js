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
    this.keyUpHandler = props.keyUpHandler;
  }
  shouldComponentUpdate () {
    return false;
  }
  componentDidMount () {
    this.props.registerHandler(this.props.keyCode, this.handler, this.keyUpHandler);
  }
  componentWillUnmount () {
    this.props.removeHandler(this.props.keyCode, this.handler, this.keyUpHandler);
  }
  render() {
    return null;
  }
}

// HOC for simplicity
function withHotkey(C) {
  const HotkeyHelper = ({ keyCode, handler, keyUpHandler, ...restProps }) => {
    return (
      <Context.Consumer>
        {({ registerHandler, removeHandler }) => {
          return (
            <Fragment>
              <HotkeyHandler keyCode={keyCode} handler={handler} keyUpHandler={keyUpHandler} registerHandler={registerHandler} removeHandler={removeHandler} />
              <C {...restProps} />
            </Fragment>
          );
        }}
      </Context.Consumer>
    );
  }
  return HotkeyHelper;
}
export default withHotkey;
