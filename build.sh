#!/bin/bash
pip install ./override_addon
mkdir -p static/pyodide
cp ~/pyodide/build/* static/pyodide/
jupyter lite serve
