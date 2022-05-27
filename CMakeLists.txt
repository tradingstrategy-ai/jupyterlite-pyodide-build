cmake_minimum_required(VERSION 3.16)

project(TS-Jupyterlite)

include(ExternalProject) # ExternalProject_Add

#### set versions of external packages here

set(PYODIDE_VERSION 0.20.0)
set(PYODIDE_SOURCE https://github.com/pyodide/pyodide.git)

function(configure_meta package_name)
    configure_file(pyodide_meta/${package_name}/meta.yaml.in pyodide_meta/${package_name}/meta.yaml)
endfunction()


# pyarrow source
set(PYARROW_WASM_VERSION 7.0.0)
set(PYARROW_WASM_SOURCE https://github.com/joemarshall/pyarrow-wasm/archive/refs/tags/7.0.0.tar.gz)
set(PYARROW_WASM_SHA256 46bb7d2fd2498ec59814d6ad3e910ce5b93614225f8031bdeacca954375c4c38)
configure_meta(pyarrow)


# requests source
set(PYODIDE_REQUESTS_VERSION 2.26.0)
set(PYODIDE_REQUESTS_SOURCE https://github.com/joemarshall/pyodide_requests/archive/refs/tags/pyodide_2.26.0.tar.gz)
set(PYODIDE_REQUESTS_SHA256 bd920d83334c11abfe3852c84b1c39800ea656dcba163472b108b2855739f886)
configure_meta(requests)

# trading strategy source
set(TRADING_STRATEGY_VERSION 0.6.9)
set(TRADING_STRATEGY_SOURCE https://github.com/joemarshall/trading-strategy/releases/download/0.6.9/trading_strategy-0.6.9-py3-none-any.whl)
set(TRADING_STRATEGY_SHA256 5bb4268b935323c3285877ac0826ce1f4427a05d27680a5659cffabf73a53257)
configure_meta(trading-strategy)

####


# first build pyodide v20 plus our additional packages

# get and patch pyodide v20 with our packages
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/pyodide
COMMAND git clone --depth 1 --branch ${PYODIDE_VERSION} ${PYODIDE_SOURCE}
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

