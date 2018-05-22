export const show = (modalId) => {
  return {
    type: '@@modal/SHOW',
    modal_id: modalId,
  }
}
export const hide = () => {
  return {
    type: '@@modal/HIDE'
  }
}
