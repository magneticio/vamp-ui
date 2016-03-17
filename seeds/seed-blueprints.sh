#! /bin/sh
BASEDIR=$(dirname $0)

# BLUEPRINTS
for f in "$BASEDIR"/blueprints/*; do
	if [[ $f == *.json ]]
	then
		filename="$BASEDIR"/blueprints/$(basename "$f")
		http POST http://$(docker-machine ip default):8080/api/v1/blueprints Content-Type:application/json < $filename
	fi
	if [[ $f == *.yml ]]
	then
		filename="$BASEDIR"/blueprints/$(basename "$f")
		http POST http://$(docker-machine ip default):8080/api/v1/blueprints Content-Type:application/x-yaml < $filename
	fi
done
