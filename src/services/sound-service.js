import { httpService } from './http-service';

const soundsEndpoint = 'api/sounds';

export const playAudio = (audioRef) => {
  if (audioRef && audioRef.current) {
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }
};

export const createSound = async (sound) => {
  try {
    return await httpService.post(soundsEndpoint, sound);
  } catch (error) {
    console.error('Error creating sound:', error);
    throw error;
  }
};

export const getSounds = async (params = {}) => {
  try {
    return await httpService.get(soundsEndpoint, params);
  } catch (error) {
    console.error('Error getting sounds:', error);
    throw error;
  }
};

export const getSoundById = async (id) => {
  try {
    return await httpService.get(`${soundsEndpoint}/${id}`);
  } catch (error) {
    console.error(`Error getting sound with ID ${id}:`, error);
    throw error;
  }
};

export const addSoundToKit = async (kitId, soundId) => {
  try {
    return await httpService.post(`${soundsEndpoint}/${kitId}/sounds/${soundId}`);
  } catch (error) {
    console.error('Failed to add sound to kit', error);
    throw error;
  }
};

export const removeSoundFromKit = async (userId, soundId) => {
  try {
    return await httpService.delete(`${soundsEndpoint}/${userId}/sounds/${soundId}`);
  } catch (error) {
    console.error('Failed to remove sound from kit', error);
    throw error;
  }
};

export const updateSound = async (id, sound) => {
  try {
    return await httpService.put(`${soundsEndpoint}/${id}`, sound);
  } catch (error) {
    console.error(`Error updating sound with ID ${id}:`, error);
    throw error;
  }
};

export const deleteSound = async (id) => {
  try {
    return await httpService.delete(`${soundsEndpoint}/${id}`);
  } catch (error) {
    console.error(`Error deleting sound with ID ${id}:`, error);
    throw error;
  }
};
