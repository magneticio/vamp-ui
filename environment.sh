#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if hash tput &> /dev/null ; then
  reset="$(tput sgr0)"
  red="$(tput setaf 1)"
  green="$(tput setaf 2)"
  yellow="$(tput setaf 3)"
else
  reset=""
  red=""
  green=""
  yellow=""
fi

ORIGIN=$1
VERSION=`git describe --tags`
echo "${green}Version         : ${yellow}${VERSION}${reset}"

if [ -z "$ORIGIN" ]; then
  DEBUG='false'
  MIXPANEL="3dc73f826819c8e11d0d9898ca4291c8"
else
  DEBUG='true'
  MIXPANEL=""
fi

echo "${green}Debug mode      : ${yellow}${DEBUG}${reset}"
echo "${green}Vamp API origin : ${yellow}${ORIGIN}${reset}"
echo "${green}Mixpanel key    : ${yellow}${MIXPANEL}${reset}"

rm -rf ${dir}/src/app/environment.js 2> /dev/null
touch ${dir}/src/app/environment.js

echo "${green}Creating file   : ${yellow}src/app/environment.js${reset}"

cat > ${dir}/src/app/environment.js << EOF
function Environment() {
}

Environment.prototype.origin = function () {
  return '${ORIGIN}';
};

Environment.prototype.mixpanel = function () {
  return '${MIXPANEL}';
};

Environment.prototype.version = function () {
  return '${VERSION}';
};

Environment.prototype.connect = function () {
  return true;
};

Environment.prototype.namespace = function () {
  return '';
};

Environment.prototype.debug = function () {
  return ${DEBUG};
};
EOF

echo "${green}Done.${reset}"
