'use strict';

const request = require('request-promise');
const Kong = require('./kong');
const Plugin = require('./plugin');
const _ = require('lodash');

class Route extends Kong {

  async create (serviceId, data) {
    const { data: route, omitted } = super.omit(data, ['plugins']);

    route.service = { id: serviceId };
    const result = await super.create('routes', route);
    this.id = result.id;

    console.log(`route ${this.id}`);    

    const plugins = omitted.plugins || [];

    for (const pluginData of plugins) {
      const plugin = new Plugin({
        host: this.host
      });
      pluginData['route_id'] = this.id;
      await plugin.create(pluginData);
    }

  }

  async get (id) {
    if (id) {
      return super.get('routes', [id]);
    }
    else {
      return super.get('routes');
    }
  }

  async delete (id) {
    if (id) {
      return super.delete('routes', [id]);
    }
    else {
      const routes = await this.get();
      for (const routeId of _.map(routes, 'id')) {
        await super.delete('routes', [routeId]);
      }
    }
  }

}

module.exports = Route;
