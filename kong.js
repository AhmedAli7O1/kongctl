'use strict';

const request = require('request-promise');
const _ = require('lodash');

class Kong {
  
  constructor ({ host = 'http://localhost:8001'}) {
    this.KONG_HOST = host;
  }

  async create (resource, data, params) {
    
    if (!_.isEmpty(params)) {
      params = _.join(params, '/');
    }

    try {
      const result = await request({
        method: 'POST',
        uri: `${this.KONG_HOST}/${resource}/${params || ''}`,
        json: true,
        body: data
      });
  
      return result;
    }
    catch (e) {
      throw this.errorFormat(e, `create new resource`);
    }
  }

  async get (resource, params) {

    if (!_.isEmpty(params)) {
      params = _.join(params, '/');
    }

    try {
      const result = await request({
        method: 'GET',
        uri: `${this.KONG_HOST}/${resource}/${params || ''}`,
        json: true
      });
      return _.get(result, 'data') || result;
    }
    catch (e) {
      throw this.errorFormat(e, `list ${resource}`);
    }
  }

  async delete (resource, params) {

    if (!_.isEmpty(params)) {
      params = _.join(params, '/');
    }

    try {
      const result = await request({
        method: 'DELETE',
        uri: `${this.KONG_HOST}/${resource}/${params || ''}`,
        json: true
      });
      return _.get(result, 'data') || result;
    }
    catch (e) {
      throw this.errorFormat(e, `delete ${resource}`);
    }
  }

  omit (data, attrs) {
    return {
      omitted: _.pick(data, attrs),
      data: _.omit(data, attrs)
    };
  }

  errorFormat(e, action) {
    e.message = `while trying to ${action} : ${e}`;
    return e;
  }

}

module.exports = Kong;
