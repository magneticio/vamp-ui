#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

curl -X PUT \
     -H "Content-Type:application/x-yaml" \
     --data-binary @${dir}/artifacts.yml http://192.168.99.100:8080/api/v1/
