'use strict';

const Kong = require('./kong');

class KeyAuth extends Kong {

  async create ({ keyAuth, consumerId }) {
    let data = {};
  
    if (typeof keyAuth === 'string') {
      data.key = keyAuth;
    }
  
    return await super.create('consumers', data, [consumerId, 'key-auth']);
  }

  async get () {
    return super.get('key-auths');
  }

}

module.exports = KeyAuth;
