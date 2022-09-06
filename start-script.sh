#!/usr/bin/env bash

# keycloak config .js version:
# export REACT_APP_KEYCLOAK_URL=$(node -pe "var window = {}; $(curl -s $REACT_APP_PNC_WEB_CONFIG_JS/pnc-web-config/config.js) pnc.config.keycloak.url")

export REACT_APP_PNC_WEB_CONFIG_JS=https://orch-master-devel.psi.redhat.com
export REACT_APP_GIT_SHORT_SHA=`git rev-parse --short HEAD`
export REACT_APP_KEYCLOAK_URL=$(node -pe "JSON.parse(process.argv[1]).keycloak.url" "$(curl -s $REACT_APP_PNC_WEB_CONFIG_JS/pnc-web-config/config.json)")

export PORT=$1
npm start --port=$1 &