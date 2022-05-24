#!/bin/bash
# install docker and auto run dockerd on wsl2 (from https://dev.to/bowmanjd/install-docker-on-windows-wsl-without-docker-desktop-34m9)

. /etc/os-release
curl -fsSL https://download.docker.com/linux/${ID}/gpg | sudo tee /etc/apt/trusted.gpg.d/docker.asc

echo "deb [arch=amd64] https://download.docker.com/linux/${ID} ${VERSION_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update

sudo apt install docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker $USER

cat << EOF >& ~/.bashrc
DOCKER_DISTRO="Ubuntu"
DOCKER_DIR=/mnt/wsl/shared-docker
DOCKER_SOCK="$DOCKER_DIR/docker.sock"
export DOCKER_HOST="unix://$DOCKER_SOCK"
if [ ! -S "$DOCKER_SOCK" ]; then
    mkdir -pm o=,ug=rwx "$DOCKER_DIR"
    chgrp docker "$DOCKER_DIR"
    /mnt/c/Windows/System32/wsl.exe -d $DOCKER_DISTRO sh -c "nohup sudo -b dockerd < /dev/null > $DOCKER_DIR/dockerd.lo>fi
fi
EOF`
