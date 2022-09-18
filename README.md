# Jupyter lite notebook site for Trading Strategy python modules

This repo builds a GitHub Pages site to run the examples from the trading-strategy pypi module.

Build by running 
```
run_docker.sh
```

This creates a docker container with the required packages for the build, then
calls cmake. 

This builds three things:
1) Pyodide (WASM based CPython), along with various custom modules which are dependencies of trading-strategy. 
This is a stock build of pyodide v20.0, with the exception of added packages

2) Packages for pyodide
    Pyodide packages have to be built inside a pyodide build, which is what we do here.
    Most of the dependencies included are pure python so just work in pyodide, or simple C extensions which build 
    easily using the pyodide automatic build system.. Exceptions are:
    - PyArrow: this is a bit of a pig to build, so I built a custom repository which builds version 7.0 in pyodide.
    - Requests: pyodide doesn't have sockets, so requests is shimmed with a custom library that calls XMLHttpRequest. 
      Under the hood, this library relies on a service worker running in the browser to make progress bars work. This
      means that if you run in an incognito window, you lose progress bars. This *might* be fixable by doing chunked 
      requests if the server supports it (technically the combination of on the wire compression and range requests 
      is in theory unsupported in HTTP, but lots of servers do support it)

3) jupyterlite
    Jupyter-lite is a jupyter notebook environment which uses the pyodide kernel to allow you to run iPython notebooks
    entirely in the browser. We use a stock build here, currently version 0.1.0b7.

# Updating source package versions / repos

Versions of pyodide and jupyterlite are set in run_docker.sh. 
Versions of the subpackages installed into pyodide (pyarrow, requests etc.) are set in CMakeLists.txt near the top. 

# Running in development mode
To run the example site, you can either serve it using `jupyterlite serve`

```
cd jupyter-src
jupyterlite serve 
```
or just serve the docs folder with python
```
cd docs
python -m http.server
```

Then connect to that site in a browser.

# Clean

```shell

rm -rf pyodide/build
rm -rf /jupyter-src/static/pyodide
rm -rf jupyter-src/_output/
rm -rf docs
rm -rf CMakeFiles
rm cmake_install.cmake
rm Makefile
rm CMakeCache.txt
find pyodide_meta \( -iname "*.yaml" -or -iname "*.tmp" \) -exec rm {} \;
```

Then make sure you nuke out all Docker containers and images:

```shell
# Delete containers and their volumes
docker rm -vf $(docker ps -aq)

# Delete images (should not needed - images are immutable)
docker rmi -f $(docker images -aq)
```


# Running on github pages

If you commit this repo to github, and set github pages settings to point to the docs folder, it should serve nicely on there.

