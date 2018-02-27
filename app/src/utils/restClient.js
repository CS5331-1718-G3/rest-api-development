import axios from 'axios';

/**
 * Performs a HTTP GET request.
 *
 * @param {string} endpoint Endpoint to fetch.
 * @returns {object|Array} JSON data.
 */
export const get = async endpoint => {
  const url = makeUrl(endpoint);
  return await axios
    .get(url)
    .then(makeResHandler(url))
    .catch(makeErrHandler(url));
};

/**
 * Checks if an endpoint returns a valid response, as signaled by the
 * "status" field in the response JSON body.
 *
 * @param {string} endpoint Endpoint to get the status for.
 * @returns {boolean} Returns true if the endpoint returns true.
 */
export const getStatus = async endpoint => {
  try {
    const url = makeUrl(endpoint);
    await axios.get(url).then(makeGetStatusHandler(url));
  } catch (err) {
    return false;
  }

  return true;
};

/**
 * Performs a HTTP POST request.
 *
 * @param {string} endpoint Endpoint to fetch.
 * @param {object} data POST data to send.
 * @returns {object|Array} JSON data.
 */
export const post = async (endpoint, data) => {
  const url = makeUrl(endpoint);
  return await axios
    .post(url, data)
    .then(makeResHandler(url))
    .catch(makeErrHandler(url));
};

const makeUrl = endpoint => {
  return `http://localhost/api${endpoint}`;
};

const makeResHandler = url => response => {
  const data = response.data;

  // Handle REST errors.
  if (!data || !data.status) {
    const handler = makeErrHandler(url);
    throw new Error(data.error);
  }

  return data.result;
};

const makeGetStatusHandler = url => response => {
  const data = response.data;
  return data && data.status;
};

const makeErrHandler = url => err => {
  throw new Error(err.message);
};
