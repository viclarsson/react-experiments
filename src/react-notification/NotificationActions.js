export const registerNotification = (containerId, data) => {
  return {
    type: '@@notification/REGISTER',
    container_id: containerId,
    data
  }
}

export const removeNotification = (containerId, notificationId, timeout = null) => {
  return {
    type: '@@notification/REMOVE',
    container_id: containerId,
    notification_id: notificationId,
    timeout
  }
}
