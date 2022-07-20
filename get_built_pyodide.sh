source envs.sh
#mkdir -p pyodide/build

wget ${PYODIDE_BUILD_DOWNLOAD} -O - | tar -xj --strip-components 1 -C pyodide/build

python - <<EOF
import json,os,shutil
with open("pyodide/build/packages.json","r") as f:
  plist=json.load(f)
  for package,info in plist['packages'].items():
    print(f"Making dist for {package}")
    os.makedirs(f"pyodide/packages/{info['name']}/build/dist",exist_ok=True)
    shutil.copyfile(f"pyodide/build/{info['file_name']}",f"pyodide/packages/{info['name']}/build/dist/{info['file_name']}")
    open(f"pyodide/packages/{info['name']}/build/.packaged", 'w'). close()
EOF

# numpy needs building into packages/.artifacts in pyodide for pyarrow to build - 
# don't need to do anything else with the build here 
rm pyodide/packages/numpy/build/.packaged

export PYODIDE_ROOT=`realpath pyodide`

pushd pyodide/pyodide-build
python -m pyodide_build buildpkg ../packages/numpy/meta.yaml
echo "Got prebuilt pyodide packages and marked as built"
popd
