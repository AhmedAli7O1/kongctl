# kongctl

a simple [kong](https://konghq.com/) commad line tool, to load api configurations from JSON file.

compatible with Kong version >= 0.13.1

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

### JSON File Structure

```json
{
  "services": [
    {
      "name": "json-server",
      "protocol": "http",
      "host": "example-server",
      "port": 3000,
      "routes": [
        {
          "protocols": ["http"],
          "paths": [
            "/json-server"
          ],
          "strip_path": true,
          "preserve_host": true,
          "plugins": [
            {
              "name": "acl",
              "config": {
                "whitelist": "user:json-server"
              }
            },
            {
              "name": "key-auth",
              "config": {
                "key_names": "api_key, api-key"
              }
            }
          ] 
        }
      ]
    }
  ],

  "consumers": [
    {
      "username": "jsons",
      "acls": [
        "user:json-server"
      ],
      "keyAuth": true
    },
    {
      "username": "lol",
      "acls": [
        "user:json-serversssss"
      ],
      "keyAuth": "asdkjkj544wdqwd-custom-key"
    }
  ]
}
```