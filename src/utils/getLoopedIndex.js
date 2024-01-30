export const getLoopedIndex = (currentIndex, arrayLength, direction) => {
  const increment = direction === 'next' ? 1 : -1;
  const newIndex = (currentIndex + increment + arrayLength) % arrayLength;
  return newIndex;
};
