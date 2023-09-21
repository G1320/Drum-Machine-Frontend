import { httpService } from './http-service';
const pageDataEndpoint = 'api/pageData';

// export const getPageData = async (identifier) => {
//   try {
//     const pageData = await httpService.get(`${pageDataEndpoint}/${identifier}`);
//     return pageData;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

export const getPageData = async (identifier) => {
  try {
    const pageData = await httpService.get(`${pageDataEndpoint}/${identifier}`);
    return pageData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
