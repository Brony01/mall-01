import { SETHEADTITLE } from './action-type';

export const setHeadTitle = (title) => ({
  type: SETHEADTITLE,
  data: title,
});
