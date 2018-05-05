import React, { PureComponent } from 'react';

function NotificationWrapper(C, mode) {
  return class Temp extends PureComponent {
    constructor (props) {
      super(props);
      this.state = {
        notifications: []
      };
      this.renderComponent = this.renderComponent.bind(this);
      this.updateRenderQueue = this.updateRenderQueue.bind(this);
    }

    componentWillReceiveProps (nextProps) {
      if (
        this.props.notifications !== nextProps.notifications ||
        this.props.mode !== nextProps.mode
      ) {
        this.updateRenderQueue(nextProps.notifications);
      }
    }

    dismiss (cId, id) {
      const { dismiss } = this.props;
      return () => {
        dismiss(cId, id);
      }
    }

    updateRenderQueue (notifications) {
      const { dismiss, id } = this.props;
      let temp = mode === 'first' && notifications[0] ? [notifications[0]] || null : notifications;
      this.setState({ notifications: temp });
    }

    renderComponent (n) {
      const { dismiss, id } = this.props;
      return (<C key={n.id} notification={n} dismiss={this.dismiss(id, n.id)} />);

    }

    render () {
      return this.state.notifications.map(this.renderComponent);
    }
  }
}

export default NotificationWrapper;
