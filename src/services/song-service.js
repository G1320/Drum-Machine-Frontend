import { httpService } from './http-service';

const songEndpoint = '/songs';

export const createSong = async (songData) => {
  try {
    return await httpService.post(`${songEndpoint}/`, songData);
  } catch (error) {
    console.error('Failed to create song', error);
    throw error;
  }
};

export const getUserSongs = async (userId) => {
  try {
    return await httpService.get(`${songEndpoint}/${userId}`);
  } catch (error) {
    console.error('Failed to get user songs', error);
    throw error;
  }
};

export const updateSong = async (songId, songData) => {
  try {
    return await httpService.put(`${songEndpoint}/update-song/${songId}`, songData);
  } catch (error) {
    console.error('Failed to update song', error);
    throw error;
  }
};

export const deleteSong = async (userId,songId) => {
  try {
    return await httpService.delete(`${songEndpoint}/delete-song/${userId}/${songId}`);
  } catch (error) {
    console.error('Failed to delete song', error);
    throw error;
  }
};

export const getSongById = async (songId) => {
  try {
    return await httpService.get(`${songEndpoint}/${songId}`);
  } catch (error) {
    console.error('Failed to retrieve song', error);
    throw error;
  }
};
