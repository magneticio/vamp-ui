#! /bin/sh
BASEDIR=$(dirname $0)

for f in "$BASEDIR"/*; do
	if [[ $f == *.json ]] 
	then
		filename=$(basename "$f")
		http POST http://192.168.59.103:8080/api/v1/breeds Content-Type:application/json < $filename
	fi
done
#cd /my_folder \
#&& rm *.jar \
#&& svn co path to repo \
#&& mvn compile package install