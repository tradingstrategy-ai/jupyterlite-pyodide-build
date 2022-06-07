#! /bin/bash
#
#    This script creates a conda environment with the right python version etc. 
#    and runs cmake inside it
#

CONDA_ENVIRONMENT_NAME=jupyterlite-build


# Make conda command work in shell
CONDA_BASE=$(conda info --base)
source ${CONDA_BASE}/etc/profile.d/conda.sh

# make environment if it doesn't exist
conda env list | grep  ${CONDA_ENVIRONMENT_NAME} || conda create -y --name ${CONDA_ENVIRONMENT_NAME} python=3.9 wheel cmake pkginfo
conda activate ${CONDA_ENVIRONMENT_NAME}
# jupyterlite builder
python -m pip install jupyterlite --pre
# custom module that installs the service worker
python  -m pip install -U jupyter-src/override_addon

cmake .
cmake --build .
