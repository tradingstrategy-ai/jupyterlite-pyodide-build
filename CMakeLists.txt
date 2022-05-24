cmake_minimum_required(VERSION 3.16)

project(TS-Jupyterlite)

include(ExternalProject) # ExternalProject_Add



# first build pyodide v20 plus our additional packages

# get and patch pyodide v20 with our packages
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/pyodide
COMMAND git clone --depth 1 --branch 0.20.0 https://github.com/pyodide/pyodide.git
COMMAND git config apply.whitespace nowarn && cd pyodide && git apply ${CMAKE_SOURCE_DIR}/patches/pyodide-build.patch 
COMMAND echo cp -r ${CMAKE_SOURCE_DIR}/pyodide_meta/* packages/ 
COMMAND rm -rf ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide
)

# build pyodide
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide/pyodide.js
COMMAND cd ${CMAKE_SOURCE_DIR}/pyodide && ./run_docker bash ./ts-build-packages.sh
COMMAND mkdir -p ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide
COMMAND cp -r ${CMAKE_SOURCE_DIR}/pyodide/build/* ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide/
DEPENDS ${CMAKE_SOURCE_DIR}/pyodide
)

# build jupyter-lite site in docs folder for github pages
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/docs
COMMAND ${Python_EXECUTABLE} -m pip install -pre jupyterlite
COMMAND ${Python_EXECUTABLE} -m pip install -U jupyter-src/override_addon
COMMAND mkdir -p ${CMAKE_SOURCE_DIR}/docs
COMMAND cd ${CMAKE_SOURCE_DIR}/jupyter-src && rm -rf _output && jupyter lite build
COMMAND cp -r ${CMAKE_SOURCE_DIR}/jupyter-src/_output/* ${CMAKE_SOURCE_DIR}/docs
DEPENDS ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide/pyodide.js
)

add_custom_target(final ALL
DEPENDS ${CMAKE_SOURCE_DIR}/docs
)


