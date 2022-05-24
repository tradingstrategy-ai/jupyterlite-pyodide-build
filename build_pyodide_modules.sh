#! /bin/bash
# to build pyodide modules we need a full build of pyodide currently 
git submodule init
cd pyodide
cp ../pyodide_metafiles/* packages/ -r
git apply ../patches/pyodide-build.patch 
./run_docker bash ts-build-packages.sh


