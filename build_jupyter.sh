#!/bin/bash
# change to script directory
if [[ $BASH_SOURCE = */* ]]; then
     cd -- "${BASH_SOURCE%/*}/" || exit
fi
echo $PWD
pip install jupyter-build/override_addon
mkdir -p jupyter-src/static/pyodide
mkdir -p docs
cp ~/pyodide/build/* jupyter-src/static/pyodide/
rm -rf docs/*
cd jupyter-src
rm -rf _output
jupyter lite build
cp -r _output/* ../docs
