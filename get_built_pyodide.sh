source envs.sh
mkdir -p pyodide/build
wget ${PYODIDE_BUILD_DOWNLOAD} -O - | tar -xj --strip-components 1 -C pyodide/build
for pname in pyodide/packages/*/; do
    mkdir -p ${pname}/build
    echo > ${pname}/build/.packaged
done
# numpy needs building into packages/.artifacts in pyodide for pyarrow to build - 
# don't need to do anything else with the build here 
rm pyodide/packages/numpy/build/.packaged

export PYODIDE_ROOT=`realpath pyodide`

pushd pyodide/pyodide-build
python -m pyodide_build buildpkg ../packages/numpy/meta.yaml
echo "Got prebuilt pyodide packages and marked as built"
popd
