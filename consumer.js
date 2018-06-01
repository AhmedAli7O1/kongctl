'use strict';

const _ = require('lodash');
const Kong = require('./kong');
const ACL = require('./acl');
const KeyAuth = require('./keyAuth');

class Consumer extends Kong{

  async create(data) {
    const { data: consumer, omitted } = super.omit(data, ['acls', 'keyAuth']);
    const { acls = [], keyAuth } = omitted;

    const result = await super.create('consumers', consumer);
    this.id = result.id;
    console.log(`consumer ${data.username || data.custom_id}`);

    for (const group of acls) {
      const acl = new ACL({ host: this.host });
      await acl.create({ consumerId: this.id, group });
      console.log(`group ${group}`);
    }

    if (keyAuth){
      const keyAuthObj = new KeyAuth({ host: this.host });
      const { key } = await keyAuthObj.create({ consumerId: this.id, keyAuth });
      console.log(`key ${key}`);
    }

  }

  async createKeyAuth (keyAuth) {
    let data = {};
  
    if (typeof keyAuth === 'string') {
      data.key = keyAuth;
    }
  
    return await super.create('consumers', data, [this.id, 'key-auth']);
  }

  async get (id) {
    if (id) {
      return super.get('consumers', [id]);
    }
    else {
      return super.get('consumers');
    }
  }

  async delete (id) {
    if (id) {
      return super.delete('consumers', [id]);
    }
    else {
      const consumers = await this.get();
      for (const consumerId of _.map(consumers, 'id')) {
        await super.delete('consumers', [consumerId]);
      }
    }
  }

}

module.exports = Consumer;
