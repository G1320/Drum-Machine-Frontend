import { httpService } from './http-service';

export const localSaveSelectedCells = (selectedCells) => {
  sessionStorage.setItem('selectedCells', JSON.stringify(selectedCells));
};

export const getLocalSelectedCells = () => {
  const selectedCells = sessionStorage.getItem('selectedCells');

  if (selectedCells) return JSON.parse(selectedCells);

  return [];
};
