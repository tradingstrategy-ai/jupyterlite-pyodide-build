#!/bin/bash
set -e
# we piggy back on the pyodide docker image as
# a) it has everything we need for building 
# b) it means we don't need to launch a separate docker for pyodide build 
PYODIDE_IMAGE_REPO="pyodide"
PYODIDE_IMAGE_TAG="20220317-chrome99-firefox98-py310"
PYODIDE_PREBUILT_IMAGE_TAG="0.20.0"
DEFAULT_PYODIDE_DOCKER_IMAGE="${PYODIDE_IMAGE_REPO}/pyodide-env:${PYODIDE_IMAGE_TAG}"
PYODIDE_VERSION=${PYODIDE_PREBUILT_IMAGE_TAG}
PYODIDE_SOURCE=https://github.com/pyodide/pyodide.git
JUPYTERLITE_VERSION="0.1.0b9"
DOCKEROPT=

docker build . --build-arg base_image=${DEFAULT_PYODIDE_DOCKER_IMAGE} -t tradingstrategy:jupyterlite && \
if [ -t 0 ] ; then
    DOCKEROPT=-it
fi

docker run  ${DOCKEROPT} -w /home/docker/src --pull==never -v "$PWD":"/home/docker/src"  tradingstrategy:jupyterlite bash  -c "export MAKE=make && cmake . -D PYODIDE_VERSION=${PYODIDE_VERSION} -D PYODIDE_SOURCE=${PYODIDE_SOURCE} -D JUPYTERLITE_VERSION=${JUPYTERLITE_VERSION} -DCMAKE_MAKE_PROGRAM=/usr/bin/make " 
docker run  ${DOCKEROPT} -w /home/docker/src --pull==never -v "$PWD":"/home/docker/src"   tradingstrategy:jupyterlite bash  -c "export MAKE=make && export PYODIDE_JOBS=10 && make -j 10"
if [ -t 0 ] ; then
  docker run  ${DOCKEROPT} -w /home/docker/src --pull==never -v "$PWD":"/home/docker/src"   tradingstrategy:jupyterlite bash    
fi
