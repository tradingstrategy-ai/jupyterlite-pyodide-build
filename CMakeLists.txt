cmake_minimum_required(VERSION 3.16)

project(TS-Jupyterlite)

include(ExternalProject) # ExternalProject_Add

#### set versions of external packages here

set(PYODIDE_VERSION 0.20.0)
set(PYODIDE_SOURCE https://github.com/pyodide/pyodide.git)

set(JUPYTERLITE_VERSION 0.1.0b7)

function(configure_meta package_name)
    configure_file(${CMAKE_SOURCE_DIR}/pyodide_meta/${package_name}/meta.yaml.in ${CMAKE_SOURCE_DIR}/pyodide_meta/${package_name}/meta.yaml)
    add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.meta_configured
        COMMAND mkdir ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}
        COMMAND cp ${CMAKE_SOURCE_DIR}/pyodide_meta/${package_name}/meta.yaml ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/meta.yaml
        # force rebuild if meta file changes
        COMMAND rm -rf ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/build/
        # force refind of dependencies
        COMMAND rm -f ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.deps_made
        COMMAND touch ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.meta_configured
        DEPENDS ${CMAKE_SOURCE_DIR}/pyodide_meta/${package_name}/meta.yaml
    )
    set(META_DEPENDENCIES_OUTPUTS ${META_DEPENDENCIES_OUTPUTS} ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.meta_configured PARENT_SCOPE)
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
COMMAND rm -rf ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide
)


add_custom_target(get_and_patch_pyodide 
    DEPENDS ${CMAKE_SOURCE_DIR}/pyodide
)

function(create_pyodide_dependencies package_name)
    add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.deps_made
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/pyodide
        COMMAND echo "Create dependencies for pyodide package ${NAME}"
        COMMAND echo "export PYODIDE_ROOT=/src;cd /src/pyodide-build/pyodide_build;python mkpkg.py --make-dependencies --find-correct-imports ${package_name};true" > makemeta.sh
        COMMAND ./run_docker bash makemeta.sh        
        COMMAND touch ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.deps_made
        VERBATIM
    )
    set(META_DEPENDENCIES_OUTPUTS ${META_DEPENDENCIES_OUTPUTS} "${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.deps_made" PARENT_SCOPE)
endfunction()

function(create_pyodide_no_dependencies package_name)
    add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.deps_made
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/pyodide
        COMMAND echo "Create pyodide package ${NAME}"
        COMMAND echo "export PYODIDE_ROOT=/src;cd /src/pyodide-build/pyodide_build;python mkpkg.py --find-correct-imports ${package_name};true" > makemeta.sh
        COMMAND ./run_docker bash makemeta.sh        
        COMMAND touch ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.deps_made
        VERBATIM
    )
    set(META_DEPENDENCIES_OUTPUTS ${META_DEPENDENCIES_OUTPUTS} "${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.deps_made" PARENT_SCOPE)
endfunction()



# get packages from pypi for pyodide dependencies
create_pyodide_dependencies(trading-strategy)
# need nbformat so graphs work
create_pyodide_dependencies(nbformat)



# build pyodide
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide/pyodide.js
COMMAND cd ${CMAKE_SOURCE_DIR}/pyodide && ./run_docker PYODIDE_PACKAGES=* make
COMMAND mkdir -p ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide
COMMAND find ${CMAKE_SOURCE_DIR}/pyodide/build/ -not -name *tests*.tar  -exec cp {} ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide/ ";"
# force rebuild of jupyterlite if we change pyodide at all
COMMAND rm -rf ${CMAKE_SOURCE_DIR}/jupyter-src/_output
DEPENDS get_and_patch_pyodide
DEPENDS ${META_DEPENDENCIES_OUTPUTS}
VERBATIM
)

add_custom_target(build_pyodide
DEPENDS ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide/pyodide.js
DEPENDS get_and_patch_pyodide
DEPENDS ${META_DEPENDENCIES_OUTPUTS}
)


find_package(Python COMPONENTS Interpreter)


# build jupyter-lite site 
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/jupyter-src/_output
COMMAND ${Python_EXECUTABLE} -m pip install --pre jupyterlite==${JUPYTERLITE_VERSION}
COMMAND ${Python_EXECUTABLE} -m pip install wheel
COMMAND ${Python_EXECUTABLE} -m pip install -U jupyter-src/override_addon
COMMAND cd ${CMAKE_SOURCE_DIR}/jupyter-src && rm -rf _output && jupyter lite build
DEPENDS build_pyodide
)

set(PYOLITE_WHEEL ${CMAKE_SOURCE_DIR}/jupyter-src/_output/build/pypi/pyolite-${JUPYTERLITE_VERSION}-py3-none-any.whl)

# patch jupyterlite and copy across
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/docs/index.html
# patch matplotlib patch in jupyterlite
# (until https://github.com/jupyterlite/jupyterlite/pull/654 is merged)
WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
COMMAND python -m wheel unpack ${PYOLITE_WHEEL} -d pyolite_wheel
COMMAND cp -r pyolite pyolite_wheel/pyolite-${JUPYTERLITE_VERSION}
COMMAND mkdir -p ${CMAKE_SOURCE_DIR}/jupyter-src/pypi
COMMAND python -m wheel pack pyolite_wheel/pyolite-${JUPYTERLITE_VERSION} -d ${CMAKE_SOURCE_DIR}/jupyter-src/pypi
COMMAND rm -rf pyolite_wheel
# rebuild jupyter site to regenerate hash for patched wheel
COMMAND cd ${CMAKE_SOURCE_DIR}/jupyter-src && jupyter lite build
COMMAND mkdir -p ${CMAKE_SOURCE_DIR}/docs
COMMAND bash -c "cp -r ${CMAKE_SOURCE_DIR}/jupyter-src/_output/* ${CMAKE_SOURCE_DIR}/docs"
DEPENDS  ${CMAKE_SOURCE_DIR}/jupyter-src/_output
VERBATIM
)

add_custom_target(build_jupyter 
DEPENDS ${CMAKE_SOURCE_DIR}/docs/index.html
)


add_dependencies(build_jupyter build_pyodide)

add_custom_target(final ALL)

add_dependencies(final build_jupyter)

