'use strict';

const Kong = require('./kong');

class ACL extends Kong {

  async create (data) {
    return await super.create('consumers', { group: data.group }, [data.consumerId, 'acls']);
  }

  async get () {
    return super.get('acls');
  }

}

module.exports = ACL;
