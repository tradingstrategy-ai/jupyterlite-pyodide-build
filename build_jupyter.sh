#!/bin/bash
# change to script directory
if [[ $BASH_SOURCE = */* ]]; then
     cd -- "${BASH_SOURCE%/*}/" || exit
fi


pip install -U jupyter-src/override_addon
mkdir -p jupyter-src/static/pyodide
mkdir -p docs
cp pyodide/build/* jupyter-src/static/pyodide/
rm -rf docs/*
cd jupyter-src
rm -rf _output
JUPYTER_COMMAND=build
if [ -n "$1" ]; then
    JUPYTER_COMMAND=$1
fi
jupyter lite ${JUPYTER_COMMAND}
cp -r _output/* ../docs
