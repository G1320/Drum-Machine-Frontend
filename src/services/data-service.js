import { httpService } from './http-service';

const pageDataEndpoint = '/pageData';

export const getPageData = async (identifier) => {
  try {
    return await httpService.get(`${pageDataEndpoint}/${identifier}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
