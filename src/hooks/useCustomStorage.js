import { useState, useEffect } from 'react';
import { Storage } from '@ionic/storage';

const useCustomStorage = (key, initialValue) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await Storage.get({ key });
        if (storedValue.value !== null) {
          setValue(JSON.parse(storedValue.value));
        }
      } catch (error) {
        console.error(`Error loading value for key "${key}":`, error);
      }
    };

    loadValue();
  }, [key]);

  const setStoredValue = async (newValue) => {
    try {
      setValue(newValue);
      await Storage.set({ key, value: JSON.stringify(newValue) });
    } catch (error) {
      console.error(`Error saving value for key "${key}":`, error);
    }
  };

  const clearStoredValue = async () => {
    try {
      setValue(initialValue);
      await Storage.remove({ key });
    } catch (error) {
      console.error(`Error clearing value for key "${key}":`, error);
    }
  };

  return [value, setStoredValue, clearStoredValue];
};

export default useCustomStorage;
