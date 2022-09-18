#!/bin/bash
# 
# Clean up previous build's output
# 
#
#

set -e

rm -rf pyodide/
rm -rf /jupyter-src/static/pyodide
rm -rf jupyter-src/_output/
rm -rf docs
rm -rf CMakeFiles
rm cmake_install.cmake
rm Makefile
rm CMakeCache.txt
find pyodide_meta \( -iname "*.yaml" -or -iname "*.tmp" \) -exec rm {} \;