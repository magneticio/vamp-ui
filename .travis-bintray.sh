#!/usr/bin/env bash

VERSION="$( git describe --tags )"

: ${BINTRAY_USER:?"No BINTRAY_USER set"}
: ${BINTRAY_API_KEY:?"No BINTRAY_API_KEY set"}
: ${VERSION:?"Not set"}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd ${DIR}
mv dist vamp-ui && tar -cvjSf vamp-ui.tar.bz2 vamp-ui

for FILE in `find ${DIR} | grep vamp-ui.tar.bz2`
do
  DELIVERABLE=`basename "${FILE}"`

  if curl --output /dev/null --silent --head --fail "https://bintray.com/artifact/download/magnetic-io/downloads/vamp-ui/${DELIVERABLE}"; then
    echo "${DELIVERABLE} already uploaded"
  else
    echo "Uploading ${DELIVERABLE} to Bintray"
    curl -v -T ${DIR}/${DELIVERABLE} \
     -u${BINTRAY_USER}:${BINTRAY_API_KEY} \
     -H "X-Bintray-Package:vamp-ui" \
     -H "X-Bintray-Version:$VERSION" \
     -H "X-Bintray-Publish:1" \
     https://api.bintray.com/content/magnetic-io/downloads/vamp-ui/${DELIVERABLE}
  fi
done
