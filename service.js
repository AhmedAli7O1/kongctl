'use strict';

const request = require('request-promise');
const Kong = require('./kong');
const _ = require('lodash');
const Route = require('./route');

class Service extends Kong {

  async create (data) {
    const { data: service, omitted } = super.omit(data, ['routes']);
    const routes = omitted.routes || [];

    const result = await super.create('services', service);
    this.id = result.id;

    console.log(`service ${service.name}`);

    for (const routeData of routes) {
      const route = new Route({ host: this.host });
      await route.create(this.id, routeData);
    }

  }

  async get (id) {
    if (id) {
      return super.get('services', [id]);
    }
    else {
      return super.get('services');
    }
  }

  async delete (id) {
    if (id) {
      return super.delete('services', [id]);
    }
    else {
      const services = await this.get();
      for (const serviceId of _.map(services, 'id')) {
        await super.delete('services', [serviceId]);
      }
    }
  }

}

module.exports = Service;
