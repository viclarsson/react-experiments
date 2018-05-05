import { PureComponent } from 'react';

class TestComponent extends PureComponent {
  render() {
    return this.props.children || null;
  }
}

export default TestComponent;
