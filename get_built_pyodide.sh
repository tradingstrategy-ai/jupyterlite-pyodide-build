source envs.sh
set -e
mkdir -p pyodide/build

wget ${PYODIDE_BUILD_DOWNLOAD} -O - | tar -xj --strip-components 1 -C pyodide/build

python - <<EOF
import json,os,shutil
with open("pyodide/build/packages.json","r") as f:
  plist=json.load(f)
  for package,info in plist['packages'].items():
    if os.path.exists(f"pyodide/packages/{info['name']}/meta.yaml"):
        print(f"Making dist for {package}")
        os.makedirs(f"pyodide/packages/{info['name']}/build/dist",exist_ok=True)
        shutil.copyfile(f"pyodide/build/{info['file_name']}",f"pyodide/packages/{info['name']}/build/dist/{info['file_name']}")
        open(f"pyodide/packages/{info['name']}/build/.packaged", 'w'). close()
EOF


