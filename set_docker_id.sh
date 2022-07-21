#!/usr/bin/env bash
echo starting bash - arguments [ "$@" ]
echo outer GID,UID = ${OUTER_GID}:${OUTER_UID}
sudo groupmod -g ${OUTER_GID} docker
sudo usermod -u ${OUTER_UID} docker
"$@"
