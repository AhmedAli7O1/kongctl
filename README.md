# kongctl

a simple [kong](https://konghq.com/) commad line tool, to load api configurations from JSON file.

### setup

```bash
npm i -g kongctl
```

### commands

```bash
  create                 create services
  delete-all             delete everything
  get-services           list all services
  get-routes             list all routes
  get-plugins            list all plugins
  get-consumers          list all consumers
  delete-services        delete all consumers
  delete-routes          delete all routes
  delete-plugins         delete all plugins
  delete-consumers       delete all consumers
```

#### options

```bash
  -h, --host STRING      kong instance host
  -f, --file FILE        services json file path
```


### examples
```bash
# create
kongctl -h http://localhost:8001 --file=config.json create

# delete everything
kongctl -h http://localhost:8001 delete-all

# get all services
kongctl -h http://localhost:8001 get-services

# get service with id
kongctl -h http://localhost:8001 get-services <id>
```

for the full commands list 

```bash
kongctl --help
```