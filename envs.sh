PYODIDE_IMAGE_REPO="pyodide"
PYODIDE_IMAGE_TAG="20220317-chrome99-firefox98-py310"
PYODIDE_PREBUILT_IMAGE_TAG="0.21.2"
DEFAULT_PYODIDE_DOCKER_IMAGE="${PYODIDE_IMAGE_REPO}/pyodide-env:${PYODIDE_IMAGE_TAG}"
PYODIDE_VERSION=${PYODIDE_PREBUILT_IMAGE_TAG}
PYODIDE_SOURCE=https://github.com/pyodide/pyodide.git
JUPYTERLITE_VERSION="0.1.0b9"
PYODIDE_BUILD_DOWNLOAD=https://github.com/pyodide/pyodide/releases/download/${PYODIDE_PREBUILT_IMAGE_TAG}/pyodide-build-${PYODIDE_PREBUILT_IMAGE_TAG}.tar.bz2
