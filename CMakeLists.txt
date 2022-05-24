cmake_minimum_required(VERSION 3.16)

project(TS-Jupyterlite)

include(ExternalProject) # ExternalProject_Add



# first build pyodide v20 plus our additional packages

# get and patch pyodide v20 with our packages
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/pyodide
COMMAND git clone --depth 1 --branch 0.20.0 https://github.com/pyodide/pyodide.git
COMMAND git config apply.whitespace nowarn && cd pyodide && git apply ${CMAKE_SOURCE_DIR}/patches/pyodide-build.patch 
COMMAND cp -r ${CMAKE_SOURCE_DIR}/pyodide_meta/* ${CMAKE_SOURCE_DIR}/pyodide/packages/ 
COMMAND rm -rf ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide
)

add_custom_target(patch_pyodide
DEPENDS  ${CMAKE_SOURCE_DIR}/pyodide
)




# build pyodide
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide/pyodide.js
COMMAND cd ${CMAKE_SOURCE_DIR}/pyodide && ./run_docker PYODIDE_PACKAGES=* make
COMMAND mkdir -p ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide
COMMAND cp -r ${CMAKE_SOURCE_DIR}/pyodide/build/* ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide/
DEPENDS ${CMAKE_SOURCE_DIR}/pyodide
)

add_custom_target(build_pyodide
DEPENDS  ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide/pyodide.js
)

function(create_pyodide_meta package_name)
    add_custom_command(TARGET patch_pyodide
        POST_BUILD
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/pyodide
        COMMAND echo "export PYODIDE_ROOT=/src;cd /src/pyodide-build/pyodide_build;python mkpkg.py --make-dependencies --find-correct-imports ${package_name}" > makemeta.sh
        COMMAND ./run_docker bash makemeta.sh
        VERBATIM

    )
endfunction()

create_pyodide_meta(trading-strategy)


add_dependencies(build_pyodide patch_pyodide)





# build jupyter-lite site in docs folder for github pages
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/docs
COMMAND ${Python_EXECUTABLE} -m pip install -pre jupyterlite
COMMAND ${Python_EXECUTABLE} -m pip install -U jupyter-src/override_addon
COMMAND mkdir -p ${CMAKE_SOURCE_DIR}/docs
COMMAND cd ${CMAKE_SOURCE_DIR}/jupyter-src && rm -rf _output && jupyter lite build
COMMAND cp -r ${CMAKE_SOURCE_DIR}/jupyter-src/_output/* ${CMAKE_SOURCE_DIR}/docs
DEPENDS ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide/pyodide.js
)

add_custom_target(build_jupyter 
DEPENDS ${CMAKE_SOURCE_DIR}/docs
)
add_dependencies(build_jupyter build_pyodide)


add_custom_target(final ALL)

add_dependencies(final build_jupyter)

