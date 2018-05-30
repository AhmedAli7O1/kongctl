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
      const { services, consumers } = require(path.join(process.cwd(), this.config.file));

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
      throw new Error(`can\'t load kong configurations at ${this.config.file}`);
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

}

module.exports = Kongctl;
