import { httpService } from './http-service';

const kitEndpoint = 'api/kits';

export const createKit = async (kitData) => {
  try {
    return await httpService.post(kitEndpoint, kitData);
  } catch (error) {
    throw error;
  }
};

export const getKit = async (kitId) => {
  try {
    return await httpService.get(`${kitEndpoint}/${kitId}`);
  } catch (error) {
    throw error;
  }
};

export const getKits = async (params = {}) => {
  try {
    return await httpService.get(kitEndpoint, params);
  } catch (error) {
    throw error;
  }
};

export const getKitSounds = async (kitId) => {
  try {
    return await httpService.get(`${kitEndpoint}/${kitId}/sounds`);
  } catch (error) {
    throw error;
  }
};

export const updateKit = async (kitId, updatedData) => {
  try {
    return await httpService.put(`${kitEndpoint}/${kitId}`, updatedData);
  } catch (error) {
    throw error;
  }
};

export const deleteKit = async (kitId) => {
  try {
    return await httpService.delete(`${kitEndpoint}/${kitId}`);
  } catch (error) {
    throw error;
  }
};
