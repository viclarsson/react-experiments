export const start = (tourId, callback) => {
  return {
    type: 'START_TOUR',
    tour_id: tourId,
    callback
  }
}
export const next = (callback) => {
  return {
    type: 'NEXT_IN_TOUR',
    callback
  }
}
export const previous = (callback) => {
  return {
    type: 'PREVIOUS_IN_TOUR',
    callback
  }
}
export const skip = (callback) => {
  return {
    type: 'SKIP_TOUR',
    callback
  }
}
export const done = (callback) => {
  return {
    type: 'DONE_TOUR',
    callback
  }
}
