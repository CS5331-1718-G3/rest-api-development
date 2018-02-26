import axios from 'axios';

export const get = async endpoint => {
  return await axios
    .get(`http://localhost/api${endpoint}`)
    .then(response => {
      const data = response.data;

      // Handle REST errors.
      if (!data || !data.status) {
        throw new Error(data.error);
      }

      return data.result;
    })
    .catch(e => {
      // Handle HTTP client errors.
      throw new Error(e.message);
    });
};
