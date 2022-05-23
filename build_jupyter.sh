#!/bin/bash
# change to script directory
if [[ $BASH_SOURCE = */* ]]; then
     cd -- "${BASH_SOURCE%/*}/" || exit
fi
echo $PWD
pip install jupyter-build/override_addon
mkdir -p jupyter-build/static/pyodide
mkdir -p docs
cp ~/pyodide/build/* jupyter-build/static/pyodide/
rm -rf docs/*
cd jupyter-build 
rm -rf _output
jupyter lite build
cp -r _output/* ../docs
