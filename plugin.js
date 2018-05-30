'use strict';

const request = require('request-promise');
const Kong = require('./kong');

class Plugin extends Kong {

  async create (data) {
    await super.create('plugins', data);
    console.log(`plugin ${data.name}`);
  }

  async get (id) {
    if (id) {
      return super.get('plugins', [id]);
    }
    else {
      return super.get('plugins');
    }
  }

  async delete (id) {
    if (id) {
      return super.delete('plugins', [id]);
    }
    else {
      const plugins = await this.get();
      for (const plguinId of _.map(plugins, 'id')) {
        await super.delete('plugins', [plguinId]);
      }
    }
  }

}

module.exports = Plugin;
