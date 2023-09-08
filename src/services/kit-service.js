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
