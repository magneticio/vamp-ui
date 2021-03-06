#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

VAMP=$1

if [ -z "$VAMP" ]; then
  VAMP='192.168.99.100:8080' # 'localhost:9090'
fi

curl -X PUT \
     -H "Content-Type:application/x-yaml" \
     --data-binary @${dir}/artifacts.yml http://${VAMP}/api/v1/
