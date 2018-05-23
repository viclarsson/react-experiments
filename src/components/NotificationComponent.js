const NotificationComponent = ({
  notifications,
  removeNotification,
  ...props
}) => {
  return props.render({
    notifications: notifications ? notifications : [],
    removeNotification
  });
};
export default NotificationComponent;
