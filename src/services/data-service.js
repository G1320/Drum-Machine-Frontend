import { httpService } from './http-service';
const pageDataEndpoint = 'api/pageData';
export const getPageData = async (pageName) => {
  try {
    const pageData = await httpService.get(`${pageDataEndpoint}/${pageName}`);
    return pageData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
