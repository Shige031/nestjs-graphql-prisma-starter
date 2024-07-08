#!/bin/sh

# migration
npm run migrate:prod

# start application
node ./dist/main.js