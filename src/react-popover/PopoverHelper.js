import React, { PureComponent } from "react";

// Context
import Context from "./PopoverContext";

const PopoverConsumer = ({ render, ...restProps }) => {
  return (
    <Context.Consumer>
      {api => render({ ...api, ...restProps })}
    </Context.Consumer>
  );
};
export default PopoverConsumer;

/**
  Reference
*/
class PopoverReferenceComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.id = props.id;
  }
  componentDidMount() {
    const { registerPopover, forwardRef } = this.props;
    registerPopover(this.id, forwardRef);
  }
  componentWillUnmount() {
    const { unRegisterPopover } = this.props;
    unRegisterPopover(this.id);
  }
  render() {
    const { render, children, ...props } = this.props;
    if (render) return render(props);
    if (children) return children;
    return null;
  }
}
export const PopoverReference = withPopover(PopoverReferenceComponent);

// HOC for simplicity
export function withPopover(C) {
  const PopoverHelper = props => {
    return (
      <PopoverConsumer
        render={({ register, unRegister, update, popovers }) => (
          <C
            {...props}
            updatePopover={update}
            popover={popovers[props.id]}
            show={props.override || (popovers[props.id] ? popovers[props.id].show : false)}
            registerPopover={register}
            unRegisterPopover={unRegister}
          />
        )}
      />
    );
  };
  return PopoverHelper;
}
