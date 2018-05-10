import React from 'react';
import { connect } from 'react-redux';

const StateComponent = ({ state, dispatch }) => {
  return (
    <code className="f7">{JSON.stringify(state)}</code>
  );
}
export default connect(state => ({ state }))(StateComponent);
