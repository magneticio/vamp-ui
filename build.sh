#!/usr/bin/env bash

dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
target="dist"

if [ -n "$1" ]; then
  target=$1
fi

cd ${dir}

reset=`tput sgr0`
green=`tput setaf 2`

echo "${green}Vamp UI build: starting.${reset}"
echo "${green}Target directory: ${dir}/${target}${reset}"

echo "${green}Cleaning...${reset}"
rm -Rf ${dir}/build ${dir}/${target}

echo "${green}Running npm install...${reset}"
npm install

echo "${green}Running gulp dist...${reset}"
gulp dist

echo "${green}Moving files to resource directory...${reset}"
mkdir -p `dirname ${dir}/${target}` && mv ${dir}/build ${dir}/${target}

echo "${green}Vamp UI build: done.${reset}"
