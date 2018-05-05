import React, { PureComponent } from 'react';

// Context
import NotificationContainer from './Notification/NotificationContainer';
import NotificationWrapper from './Notification/NotificationWrapper';

class GlobalNotification extends PureComponent {
  render () {
    const { notification, dismiss, id } = this.props;
    console.log('Rendering footer notification!', notification);
    return (
      <div key={id}>
        {JSON.stringify(notification)}
      </div>
    )
  }
}

export default NotificationContainer(NotificationWrapper(GlobalNotification, 'all'), 'footer');
