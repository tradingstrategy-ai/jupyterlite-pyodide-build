#!/bin/bash
set -e
source envs.sh

DOCKEROPT=-t

if [ -t 0 ] ; then
    bash ./build_docker.sh
    DOCKEROPT=-it
fi


docker run  ${DOCKEROPT} -w /home/docker/src --pull==never -v "$PWD":"/home/docker/src"  tradingstrategy:jupyterlite bash -c "cd /home/docker/src && export MAKE=make && cmake . -D PYODIDE_VERSION=${PYODIDE_VERSION} -D PYODIDE_SOURCE=${PYODIDE_SOURCE} -D JUPYTERLITE_VERSION=${JUPYTERLITE_VERSION} -DCMAKE_MAKE_PROGRAM=/usr/bin/make " 
docker run  ${DOCKEROPT} -w /home/docker/src --pull==never -v "$PWD":"/home/docker/src"   tradingstrategy:jupyterlite bash -c "export MAKE=make && export PYODIDE_JOBS=10 && make -j 10"
if [ -t 0 ] ; then
  docker run  ${DOCKEROPT} -w /home/docker/src --pull==never -v "$PWD":"/home/docker/src"   tradingstrategy:jupyterlite bash    
fi
