@app
split-times-a104

@aws
runtime nodejs18.x
region eu-west-1
timeout 30
# concurrency 1
# memory 1152
# profile default

@http
/*
  method any
  src server

@plugins
plugin-remix
  src plugin-remix.js

@static
