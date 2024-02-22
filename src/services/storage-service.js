import useCustomStorage from '../hooks/useCustomStorage';

export const createStorageService = (key, initialValue) => {
  const [getStorageValue, setStorageValue, clearStorageValue] = useCustomStorage(key, initialValue);

  const getValue = () => getStorageValue();
  const setValue = (value) => setStorageValue(value);
  const clearValue = () => clearStorageValue();

  return { getValue, setValue, clearValue };
};
