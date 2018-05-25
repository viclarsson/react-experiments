export const show = popoverId => {
  return {
    type: "@@popover/SHOW",
    popover_id: popoverId
  };
};
export const hide = popoverId => {
  return {
    type: "@@popover/HIDE",
    popover_id: popoverId
  };
};
