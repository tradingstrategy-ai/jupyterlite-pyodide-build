source envs.sh
mkdir -p pyodide/build
wget ${PYODIDE_BUILD_DOWNLOAD} -O - | tar -xj --strip-components 1 -C pyodide/build
for pname in pyodide/packages/*/; do
    mkdir -p ${pname}/build
    echo > ${pname}/build/.packaged
done
echo "Got prebuilt pyodide packages and marked as built"
