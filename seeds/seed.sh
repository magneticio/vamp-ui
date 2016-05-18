#! /bin/sh
BASEDIR=$(dirname $0)

# BREEDS
for f in "$BASEDIR"/breeds/*; do
	if [[ $f == *.json ]]
	then
		filename="$BASEDIR"/breeds/$(basename "$f")
		http POST http://$(docker-machine ip default):8080/api/v1/breeds Content-Type:application/json < $filename
	fi
	if [[ $f == *.yml ]]
	then
		filename="$BASEDIR"/breeds/$(basename "$f")
		http POST http://$(docker-machine ip default):8080/api/v1/breeds Content-Type:application/x-yaml < $filename
	fi
done

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

# DEPLOYMENTS
for f in "$BASEDIR"/deployments/*; do
	if [[ $f == *.json ]]
	then
		filename="$BASEDIR"/deployments/$(basename "$f")
		http POST http://$(docker-machine ip default):8080/api/v1/deployments Content-Type:application/json < $filename
	fi
	if [[ $f == *.yml ]]
	then
		filename="$BASEDIR"/deployments/$(basename "$f")
		http POST http://$(docker-machine ip default):8080/api/v1/deployments Content-Type:application/x-yaml < $filename
	fi
done
