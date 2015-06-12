#! /bin/sh
BASEDIR=$(dirname $0)

# BLUEPRINTS
for f in "$BASEDIR"/blueprints/*; do
	if [[ $f == *.json ]] 
	then
		filename=blueprints/$(basename "$f")
		http POST http://192.168.59.103:8080/api/v1/blueprints Content-Type:application/json < $filename
	fi
	if [[ $f == *.yml ]] 
	then
		filename=blueprints/$(basename "$f")
		http POST http://192.168.59.103:8080/api/v1/blueprints Content-Type:application/x-yaml < $filename
	fi
done