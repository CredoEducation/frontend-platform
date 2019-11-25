import camelCase from 'lodash.camelcase';
import snakeCase from 'lodash.snakecase';

export const modifyObjectKeys = (object, modify) => {
  // If the passed in object is not an Object, return it.
  if (
    object === undefined ||
    object === null ||
    (typeof object !== 'object' && !Array.isArray(object))
  ) {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(value => modifyObjectKeys(value, modify));
  }

  // Otherwise, process all its keys.
  const result = {};
  Object.entries(object).forEach(([key, value]) => {
    result[modify(key)] = modifyObjectKeys(value, modify);
  });
  return result;
};

export const camelCaseObject = object => modifyObjectKeys(object, camelCase);

export const snakeCaseObject = object => modifyObjectKeys(object, snakeCase);

export const convertKeyNames = (object, nameMap) => {
  const transformer = key =>
    (nameMap[key] === undefined ? key : nameMap[key]);

  return modifyObjectKeys(object, transformer);
};

export const getQueryParameters = (search = global.location.search) => {
  const keyValueFragments = search
    .slice(search.indexOf('?') + 1)
    .split('&')
    .filter(hash => hash !== '');

  return keyValueFragments.reduce((params, keyValueFragment) => {
    const split = keyValueFragment.indexOf('=');
    const key = keyValueFragment.slice(0, split);
    const value = keyValueFragment.slice(split + 1);
    return Object.assign(params, { [key]: decodeURIComponent(value) });
  }, {});
};

/**
 * This function helps catch a certain class of misconfiguration in which configuration variables
 * are not properly defined and/or supplied to a consumer that requires them.  Any key that exists
 * is still set to "undefined" indicates a misconfiguration further up in the application, and
 * should be flagged as a fatal error.
 *
 * Keys that are intended to be falsy should be defined using null, 0, false, etc.
 *
 * @param {object} objectToTest
 * @param {string} requester A human-readable identifier for the code which called this function.
 * Used when throwing errors to aid in debugging.
 *
 * @throws An error if any key in the objectToTest has a value of undefined.
 */
export function ensureDefinedConfig(object, requester) {
  Object.keys(object).forEach((key) => {
    if (object[key] === undefined) {
      throw new Error(`Module configuration error: ${key} is required by ${requester}.`);
    }
  });
}