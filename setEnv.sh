#!/bin/sh
BASE_URL=$1;

mkdir environment
chmod -R 777 environment
cd environment
sh ../generateEnvironment.sh $BASE_URL > enviroment.js
cd ..
rm -rf src/app/environment
mv -f environment src/app/
