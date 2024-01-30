export const toggleArrayItem = (array, item) => {
  const index = array.indexOf(item);
  return index === -1 ? [...array, item] : array.filter((value) => value !== item);
};
