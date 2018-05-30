'use strict';

const Service = require('./service');
const Consumer = require('./consumer');
const Route = require('./route');
const _ = require('lodash');
const path = require('path');

class Kongctl {
  
  constructor(config) {
    this.config = config;
  }

  async create() {
    try {
      const { services, consumers } = this.loadConfig();

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

  loadConfig () {
    try {
      return require(path.join(process.cwd(), this.config.file));
    }
    catch (e) {
      throw new Error(`can\'t load kong configurations from ${this.config.file}`);
    }
  }

}

module.exports = Kongctl;
