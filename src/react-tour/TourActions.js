export const start = (tourId, callback) => {
  return {
    type: "@@tour/START",
    tour_id: tourId,
    callback
  };
};
export const next = callback => {
  return {
    type: "@@tour/NEXT",
    callback
  };
};
export const previous = callback => {
  return {
    type: "@@tour/PREVIOUS",
    callback
  };
};
export const done = callback => {
  return {
    type: "@@tour/DONE",
    callback
  };
};
