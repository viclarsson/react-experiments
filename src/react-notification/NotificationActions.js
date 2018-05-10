export const registerNotification = (containerId, data) => {
  return {
    type: 'REGISTER_NOTIFICATION',
    container_id: containerId,
    data
  }
}

export const removeNotification = (containerId, notificationId) => {
  return {
    type: 'REGISTER_NOTIFICATION',
    container_id: containerId,
    notification_id: notificationId
  }
}
