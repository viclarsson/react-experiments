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
    this.ref = React.createRef();
  }
  componentDidMount() {
    const { registerPopover } = this.props;
    registerPopover(this.id, this.ref);
  }
  componentWillUnmount() {
    const { unRegisterPopover } = this.props;
    unRegisterPopover(this.id);
  }
  render() {
    const { render, children, className, component, ...props } = this.props;
    const Component = component || "span";
    return (
      <Component className={className} ref={this.ref}>
        {render ? render(props) : children}
      </Component>
    );
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
            reference={popovers[props.id]}
            show={
              props.override ||
              (popovers[props.id] ? popovers[props.id].show : false)
            }
            registerPopover={register}
            unRegisterPopover={unRegister}
          />
        )}
      />
    );
  };
  return PopoverHelper;
}
