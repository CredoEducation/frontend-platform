export default class AxiosProxy {
  constructor(httpClient) {
    this.httpClient = httpClient;
    this.allowedCorsDomains = [
      'localhost',
      'nimblywise.test',
      'credocourseware.test',
      'weaveeducation.test',
      'nimblywise.com',
      'credocourseware.com',
      'weaveeducation.com',
    ];
  }

  prepareUrl(url) {
    let corsIsAllowed = false;
    this.allowedCorsDomains.forEach((domain) => {
      if (!corsIsAllowed && global.location.hostname.endsWith(domain)) {
        corsIsAllowed = true;
      }
    });
    if (!corsIsAllowed) {
      const urlParts = new URL(url);
      return `/lms-api${urlParts.pathname}${urlParts.search}${urlParts.hash}`;
    }
    return url;
  }

  request(config) {
    return this.httpClient.request(config);
  }

  get(url, config) {
    return this.httpClient.get(this.prepareUrl(url), config);
  }

  delete(url, config) {
    return this.httpClient.delete(this.prepareUrl(url), config);
  }

  head(url, config) {
    return this.httpClient.head(this.prepareUrl(url), config);
  }

  options(url, config) {
    return this.httpClient.options(this.prepareUrl(url), config);
  }

  post(url, data, config) {
    return this.httpClient.post(this.prepareUrl(url), data, config);
  }

  put(url, data, config) {
    return this.httpClient.put(this.prepareUrl(url), data, config);
  }

  patch(url, data, config) {
    return this.httpClient.patch(this.prepareUrl(url), data, config);
  }

  getUri(config) {
    return this.httpClient.getUri(config);
  }
}
