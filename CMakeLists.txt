cmake_minimum_required(VERSION 3.16)

project(TS-Jupyterlite)

include(ExternalProject) # ExternalProject_Add

#### set versions of external packages in run_docker.sh - defaults are set here in 
#### case you build manually using this cmakefile

execute_process(COMMAND  bash -c "dirname $(find ${CMAKE_SOURCE_DIR}/pyodide/cpython -name Python.h | head -1 )" 
    OUTPUT_VARIABLE PYTHON_INCLUDE_DIR
    OUTPUT_STRIP_TRAILING_WHITESPACE)

set(JUPYTERLITE_VERSION "0.1.0b9" CACHE STRING "Version of jupyterlite you are building against")
set(PYODIDE_VERSION "0.20.0" CACHE STRING "Version of pyodide you are building against")
set(PYODIDE_SOURCE "https://github.com/pyodide/pyodide.git" CACHE STRING "Pyodide git source")

# this is used to stop configure_meta forcing rebuild of packages if the metafile.in hasn't changed  
function(configure_file_if_changed src dest)
    configure_file(${src} ${dest}.tmp)
    execute_process( COMMAND ${CMAKE_COMMAND} -E compare_files ${dest}.tmp ${dest}
                 RESULT_VARIABLE compare_result
    )
    if( compare_result EQUAL 0)
        message("Not configuring ${src} ${dest}")
    else()
        configure_file(${src} ${dest})
    endif()
endfunction()

function(configure_meta package_name)
    configure_file_if_changed(${CMAKE_SOURCE_DIR}/pyodide_meta/${package_name}/meta.yaml.in ${CMAKE_SOURCE_DIR}/pyodide_meta/${package_name}/meta.yaml)
    add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.meta_configured
        COMMAND mkdir -p ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}
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


function(get_url_sha256 dest url)
execute_process(
    COMMAND bash -c "wget ${url} -qO- | sha256sum"
    OUTPUT_VARIABLE retval
    OUTPUT_STRIP_TRAILING_WHITESPACE
)
string(REGEX REPLACE "[ \t\r\n\-]" "" retval ${retval})
set(${dest} ${retval} PARENT_SCOPE)
endfunction()

# pyarrow source
set(PYARROW_WASM_VERSION 7.0.0)
set(PYARROW_WASM_SOURCE https://github.com/tradingstrategy-ai/pyarrow-wasm/archive/refs/tags/7.0.0.tar.gz)
get_url_sha256(PYARROW_WASM_SHA256 ${PYARROW_WASM_SOURCE})
configure_meta(pyarrow)


# requests source
set(PYODIDE_REQUESTS_VERSION 2.28.1)
set(PYODIDE_REQUESTS_SOURCE https://github.com/tradingstrategy-ai/pyodide_requests/archive/refs/tags/pyodide_2.28.1.tar.gz)
get_url_sha256(PYODIDE_REQUESTS_SHA256 ${PYODIDE_REQUESTS_SOURCE})
configure_meta(requests)

# trading strategy source
set(TRADING_STRATEGY_VERSION 0.6.9)
set(TRADING_STRATEGY_SOURCE https://github.com/joemarshall/trading-strategy/releases/download/0.6.9/trading_strategy-0.6.9-py3-none-any.whl)
get_url_sha256(TRADING_STRATEGY_SHA256 ${TRADING_STRATEGY_SOURCE})
configure_meta(trading-strategy)
####

# first build pyodide v20 plus our additional packages

# get and patch pyodide v20 with our packages
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/pyodide 
COMMAND git clone --depth 1 --branch ${PYODIDE_VERSION} ${PYODIDE_SOURCE} 
COMMAND git config apply.whitespace nowarn && cd pyodide && git apply ${CMAKE_SOURCE_DIR}/patches/pyodide-build.patch 
COMMAND bash ./get_built_pyodide.sh
COMMAND rm -rf ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide )

add_custom_target(get_and_patch_pyodide 
    DEPENDS ${CMAKE_SOURCE_DIR}/pyodide
)

function(create_pyodide_dependencies package_name)
    add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.deps_made
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/pyodide
        COMMAND echo "Create dependencies for pyodide package ${NAME}"
        COMMAND cd pyodide-build/pyodide_build && python mkpkg.py --make-dependencies --find-correct-imports ${package_name} || true
        COMMAND touch ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.deps_made
        VERBATIM
    )
    set(META_DEPENDENCIES_OUTPUTS ${META_DEPENDENCIES_OUTPUTS} "${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.deps_made" PARENT_SCOPE)
endfunction()

function(create_pyodide_no_dependencies package_name)
    add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.deps_made
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/pyodide
        COMMAND echo "Create pyodide package ${NAME}"
        COMMAND cd pyodide-build/pyodide_build && python mkpkg.py --find-correct-imports ${package_name} || true
        COMMAND touch ${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.deps_made
        VERBATIM
    )
    set(META_DEPENDENCIES_OUTPUTS ${META_DEPENDENCIES_OUTPUTS} "${CMAKE_SOURCE_DIR}/pyodide/packages/${package_name}/.deps_made" PARENT_SCOPE)
endfunction()



# get packages from pypi for pyodide dependencies
create_pyodide_dependencies(trading-strategy)
# need nbformat so graphs work
create_pyodide_dependencies(nbformat)
# colorlover is a dependency
create_pyodide_dependencies(colorlover)



# build pyodide, including getting prebuilt packages for everything else once pyodide and numpy are built
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/jupyter-src/static/pyodide/pyodide.js
# just build numpy first
COMMAND cd ${CMAKE_SOURCE_DIR}/pyodide && export PYODIDE_PACKAGES="numpy" &&  make
COMMAND cd ${CMAKE_SOURCE_DIR}/pyodide && export PYODIDE_PACKAGES=* &&  make
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

# build jupyter notebook-webcomponent
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/notebook-webcomponent/dist/build/notebook.js
COMMAND cd ${CMAKE_SOURCE_DIR}/notebook-webcomponent && yarn install && yarn build
DEPENDS build_pyodide
)

add_custom_target(build_webcomponent 
DEPENDS ${CMAKE_SOURCE_DIR}/notebook-webcomponent/dist/build/notebook.js
)


# build jupyter-lite site 
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/jupyter-src/_output
COMMAND cd ${CMAKE_SOURCE_DIR}/jupyter-src && rm -rf _output && jupyter lite build
DEPENDS build_pyodide
)

set(PYOLITE_WHEEL ${CMAKE_SOURCE_DIR}/jupyter-src/_output/build/pypi/pyolite-${JUPYTERLITE_VERSION}-py3-none-any.whl)

# patch jupyterlite and copy across
add_custom_command(OUTPUT ${CMAKE_SOURCE_DIR}/docs/index.html
COMMAND cd ${CMAKE_SOURCE_DIR}/jupyter-src && rm -rf _output && rm .jupyterlite.doit.db && rm -rf .cache && jupyter lite build --contents=contents
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

add_dependencies(final build_jupyter build_webcomponent)

