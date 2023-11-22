import { httpService } from './http-service';

const kitEndpoint = 'api/kits';

export const createKit = async (kitData) => {
  try {
    return await httpService.post(kitEndpoint, kitData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getKitById = async (kitId) => {
  try {
    return await httpService.get(`${kitEndpoint}/${kitId}`);
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const getKits = async (params = {}) => {
  try {
    return await httpService.get(kitEndpoint, params);
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const getKitSounds = async (kitId) => {
  try {
    return await httpService.get(`${kitEndpoint}/${kitId}/sounds`);
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const updateKitSounds = async (kitId, sounds) => {
  try {
    return await httpService.put(`${kitEndpoint}/${kitId}/sounds`, { sounds });
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const updateKit = async (kitId, updatedData) => {
  try {
    return await httpService.put(`${kitEndpoint}/${kitId}`, updatedData);
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const deleteKit = async (kitId) => {
  try {
    return await httpService.delete(`${kitEndpoint}/${kitId}`);
  } catch (error) {
    console.error(error);

    throw error;
  }
};
