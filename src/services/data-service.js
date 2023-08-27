import axios from 'axios';

export const getPageData = async (pageName) => {
  try {
    const response = await axios.get(`/api/pageData/${pageName}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
