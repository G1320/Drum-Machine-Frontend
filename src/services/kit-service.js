import { httpService } from './http-service';

const kitEndpoint = 'api/kits';

export const createKit = async (kitData) => {
  try {
    const res = await httpService.post(kitEndpoint, kitData);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getKit = async (kitId) => {
  try {
    const res = await httpService.get(`${kitEndpoint}/${kitId}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getKits = async (params = {}) => {
  try {
    const res = await httpService.get(kitEndpoint, params);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getKitSounds = async (kitId) => {
  try {
    const res = await httpService.get(`${kitEndpoint}/${kitId}/sounds`);
    console.log('res: ', res);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateKit = async (kitId, updatedData) => {
  try {
    const res = await httpService.put(`${kitEndpoint}/${kitId}`, updatedData);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteKit = async (kitId) => {
  try {
    const res = await httpService.delete(`${kitEndpoint}/${kitId}`);
    return res;
  } catch (error) {
    throw error;
  }
};
