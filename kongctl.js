'use strict';

const Service = require('./service');
const Consumer = require('./consumer');
const Route = require('./route');
const Plugin = require('./plugin');
const ACL = require('./acl');
const KeyAuth = require('./keyAuth');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

class Kongctl {
  
  constructor(config) {
    this.config = config;
  }

  async create() {
    try {
      const { services, consumers } = this._loadConfig();

      if (!_.isEmpty(services)) {
        for (const serviceData of services) {
          const service = new Service(this.config);
          await service.create(serviceData);
        }
      }

      if (!_.isEmpty(consumers)) {
        for (const consumerData of consumers) {
          const consumer = new Consumer(this.config);
          await consumer.create(consumerData);
        }
      }

    }
    catch (e) {
      console.log(e);
    }
  }

  async delete () {
    const route = new Route(this.config);
    const service = new Service(this.config);
    const consumer = new Consumer(this.config);
    
    await route.delete();
    await service.delete();
    await consumer.delete();
  }

  async get () {
    const route = new Route(this.config);
    const service = new Service(this.config);
    const consumer = new Consumer(this.config);
    const plugin = new Plugin(this.config);
    const acl = new ACL(this.config);
    const keyAuth = new KeyAuth(this.config);

    const services = await service.get();
    const routes = await route.get();
    const plugins = await plugin.get();
    const consumers = await consumer.get();
    const acls = await acl.get();
    const keys = await keyAuth.get();

    this._attachPlugins(plugins, services, routes);
    this._attachRoutes(routes, services);
    this._attachACLS(acls, consumers);
    this._attachKeyAuth(keys, consumers);

    this._clean(services);
    this._clean(consumers);

    this._saveConfig({
      services,
      consumers
    });

  }

  _loadConfig () {
    try {
      return require(path.join(process.cwd(), this.config.file));
    }
    catch (e) {
      throw new Error(`can\'t load kong configurations from ${this.config.file}`);
    }
  }

  _saveConfig (data) {
    try {
      const location = path.join(process.cwd(), this.config.file);
      fs.writeFileSync(location, JSON.stringify(data, null, 2));
    }
    catch (e) {
      throw new Error(`can\'t save kong configurations to ${this.config.file}`);
    }
  }

  _attachPlugins (plugins, services, routes) {
    _.forEach(plugins, plugin => {
      if (plugin.route_id) {
        const route = _.find(routes, { id: plugin.route_id });
        if (route) {
          route.plugins = route.plugins || [];
          plugin = _.omit(plugin, ['id', 'route_id', 'created_at']);
          route.plugins.push(plugin);
        }
      }
    });
  }

  _attachACLS (acls, consumers) {
    _.forEach(acls, acl => {
      if (acl.consumer_id) {
        const consumer = _.find(consumers, { id: acl.consumer_id });
        if (consumer) {
          consumer.acls = consumer.acls || [];
          consumer.acls.push(acl.group);
        }
      }
    });
  }

  _attachKeyAuth (keys, consumers) {
    _.forEach(keys, key => {
      if (key.consumer_id) {
        const consumer = _.find(consumers, { id: key.consumer_id });
        if (consumer) {
          consumer.keyAuth = key.key;
        }
      }
    });
  }

  _attachRoutes (routes, services) {
    _.forEach(services, service => {
      service.routes = _.filter(routes, route => route.service.id === service.id);
    });
  }

  _clean (data) {
    for (let i = 0; i < data.length; i++) {
      data[i] = _.omit(data[i], ['id', 'created_at', 'updated_at', 'service']);
      if (data[i].routes) {
        this._clean(data[i].routes);
      }
    }
  }

}

module.exports = Kongctl;
