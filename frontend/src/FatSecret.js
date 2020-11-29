import crypto from "crypto-browserify";

export default class FatSecret {
  #accessKey;
  #sharedSecret;

  /**
   * @returns {string}
   */
  static get API_BASE() {
    return "https://platform.fatsecret.com/rest/server.api";
  }

  /**
   * @constructor
   * @param {string} accessKey
   * @param {string} sharedSecret
   */
  constructor(
    accessKey = "f5de191ec32243da98a445ca8980b023",
    sharedSecret = "de90723a7663489ca7a73552bc087d3a"
  ) {
    if (!accessKey || !sharedSecret) {
      throw new Error("FAT_SECRET ENV not found");
    }
    this.#accessKey = accessKey;
    this.#sharedSecret = sharedSecret;
  }

  /**
   * @description Perform the request to fatsecret
   * @param {object} parameters
   * @returns {Promise}
   * @public
   */
  async request(parameters) {
    const query = this._createQuery(parameters);
    const signature = this._createSignature(query);
    const url = `https://cors-anywhere.herokuapp.com/${FatSecret.API_BASE}?${query}&oauth_signature=${signature}`;
    const req = await fetch(url, { method: "GET" });
    return req.json();
  }

  /**
   * @description the generated signature to the request params and return it
   * @param {string} query
   * @returns {string}
   * @private
   */
  _createSignature(query) {
    const mac = crypto.createHmac("sha1", this.#sharedSecret + "&");
    mac.update(
      `GET&${encodeURIComponent(FatSecret.API_BASE)}&${encodeURIComponent(
        query
      )}`
    );
    return encodeURIComponent(mac.digest("base64"));
  }

  /**
   * @description Build the sorted key value pair string that will be used for the hmac and request
   * @param {object} parameters
   * @returns {string}
   * @private
   */
  _createQuery(parameters) {
    parameters["format"] = "json";
    parameters["oauth_version"] = "1.0";
    parameters["oauth_signature_method"] = "HMAC-SHA1";
    parameters["oauth_nonce"] = crypto.randomBytes(10).toString("HEX");
    parameters["oauth_timestamp"] = Math.floor(new Date().getTime() / 1000);
    parameters["oauth_consumer_key"] = this.#accessKey;
    return Object.keys(parameters)
      .sort()
      .reduce((accumulator, parameter) => {
        const data = `&${parameter}=${encodeURIComponent(
          parameters[parameter]
        )}`;
        return accumulator + data;
      }, "")
      .slice(1);
  }
}
