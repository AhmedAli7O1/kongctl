#!/usr/bin/env node

'use strict';

const cli = require('cli');
const _ = require('lodash');
const Kongctl = require('./kongctl');
const Service = require('./service');
const Route = require('./route');
const Plugin = require('./plugin');
const Consumer = require('./consumer');

cli.parse(
  {
    host: ['h', 'kong instance host', 'string'],
    file: ['f', 'path for the json file containing kong configurations', 'file']
  },
  {
    'import': 'import all kong configurations from json file',
    'export': 'export all kong configurations to a json file',

    'delete-all': 'delete everything',

    'get-services': 'list all services',
    'get-routes': 'list all routes',
    'get-plugins': 'list all plugins',
    'get-consumers': 'list all consumers',

    'delete-services': 'delete all consumers',
    'delete-routes': 'delete all routes',
    'delete-plugins': 'delete all plugins',
    'delete-consumers': 'delete all consumers',
  }
);

const kongctl = new Kongctl(cli.options);
const service = new Service(cli.options);
const route = new Route(cli.options);
const plugin = new Plugin(cli.options);
const consumer = new Consumer(cli.options);


async function exec() {

  switch (cli.command) {
    case 'import':
      requiredOption(['host', 'file']);
      await kongctl.create();
      break;

    case 'export':
      requiredOption(['host', 'file']);
      await kongctl.get();
      break;

    case 'get-services':
      requiredOption(['host']);
      output(await service.get(cli.args[0]))
      break;
    case 'get-routes':
      requiredOption(['host']);
      output(await route.get(cli.args[0]));
      break;
    case 'get-plugins':
      requiredOption(['host']);
      output(await plugin.get(cli.args[0]));
      break;
    case 'get-consumers':
      requiredOption(['host']);
      output(await consumer.get(cli.args[0]));
      break;

    case 'delete-services':
      requiredOption(['host']);
      await service.delete(cli.args[0]);
      break;
    case 'delete-routes':
      requiredOption(['host']);
      await service.delete(cli.args[0]);
      break;
    case 'delete-plugins':
      requiredOption(['host']);
      await service.delete(cli.args[0]);
      break;
    case 'delete-consumers':
      requiredOption(['host']);
      await service.delete(cli.args[0]);
      break;

    case 'delete-all':
      requiredOption(['host']);
      await kongctl.delete();
      break;
  }

}

function requiredOption(opts) {

  const errors = [];

  _.forEach(opts, x => {
    const exist = cli.options[x];
    if (!exist) {
      errors.push(`option >> ${x} << is required!`);
    }
  });

  if (errors.length) {
    _.forEach(errors, x => console.log(x));
    process.exit(1);
  }

}

function output(data) {
  console.log(JSON.stringify(data, null, 2));
}

exec()
  .then()
  .catch(console.log);