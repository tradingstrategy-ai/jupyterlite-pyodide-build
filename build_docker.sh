#!/bin/bash
set -e
#get all environment variables from envs.sh
source envs.sh

docker build . --build-arg base_image=${DEFAULT_PYODIDE_DOCKER_IMAGE} -t tradingstrategy:jupyterlite 
