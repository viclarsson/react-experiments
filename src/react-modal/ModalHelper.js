import React from 'react';

// Context
import Context from './ModalContext';

const ModalContainer = ({ render, ...restProps }) => {
  return (
    <Context.Consumer>
      {({ active }) => render({ ...restProps, active })}
    </Context.Consumer>
  );
}
export default ModalContainer;

// HOC for simplicity
export function withModal(C) {
  const ModalHelper = (props) => {
    return (
      <ModalContainer render={({ active, ...props }) => (<C {...props} activeModalId={active}/>)} />
    );
  }
  return ModalHelper;
}
