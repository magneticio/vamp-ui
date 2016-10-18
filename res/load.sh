#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

curl -X PUT \
     -H "Content-Type:application/x-yaml" \
     --data-binary @${dir}/artifacts.yml http://localhost:9090/api/v1/
