import { connect } from 'react-redux';

const StateComponent = ({ state, dispatch }) => {
  return JSON.stringify(state, null, 2);
}
export default connect(state => ({ state }))(StateComponent);
