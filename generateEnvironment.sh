#!/bin/sh


#define parameters which are passed in.
BASE_URL=$1;
if [ "$BASE_URL" == "production" ]; then
  END_URL="window.location.origin + '/api/v1/'"
fi

if [ "$BASE_URL" != "production" ]; then
  END_URL="'http://$BASE_URL' + '/api/v1/'";
fi

#define the template.
cat  << EOF
function Environment() {

}

Environment.prototype.getApiBaseUrl = function () {
  return $END_URL;
};

angular
  .module('app')
  .service('Environment', Environment);
EOF

