#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

reset=`tput sgr0`
red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`

BASE_URL=$1
VERSION=`git describe --tags`
echo "${green}Version               : ${yellow}${VERSION}${reset}"

if [ -z "$BASE_URL" ]; then
  BASE_URL="window.location.origin + window.location.pathname"
  ENDPOINT_URL="${BASE_URL} + 'api/v1/'"
  MIXPANEL_API_KEY="3dc73f826819c8e11d0d9898ca4291c8"
  echo "${green}No base URL, using    : ${yellow}${BASE_URL}${reset}"
else
  BASE_URL="http://${BASE_URL}"
  ENDPOINT_URL="'${BASE_URL}/api/v1/'"
  MIXPANEL_API_KEY=""
  echo "${green}Base URL              : ${yellow}${BASE_URL}${reset}"
fi

echo "${green}Vamp API endpoint URL : ${yellow}${ENDPOINT_URL}${reset}"

rm -rf ${dir}/src/app/environment 2> /dev/null
mkdir -p ${dir}/src/app/environment && touch ${dir}/src/app/environment/environment.js

echo "${green}Creating file         : ${yellow}src/app/environment/environment.js${reset}"

cat > ${dir}/src/app/environment/environment.js << EOF
function Environment() {
}

Environment.prototype.getApiBaseUrl = function () {
  return ${ENDPOINT_URL};
};

Environment.prototype.mixpanelApiKey = function () {
  return '${MIXPANEL_API_KEY}';
};

Environment.prototype.version = function () {
  return '${VERSION}';
};

angular.module('app').service('Environment', Environment);
EOF

echo "${green}Done.${reset}"
