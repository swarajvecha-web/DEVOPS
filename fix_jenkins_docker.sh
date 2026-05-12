#!/bin/bash
set -e

echo "=== Fixing broken packages ==="
apt-get install -y -f

echo "=== Installing prerequisites ==="
apt-get install -y ca-certificates curl gnupg lsb-release

echo "=== Adding Docker GPG key ==="
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo "=== Adding Docker repo ==="
ARCH=$(dpkg --print-architecture)
CODENAME=$(lsb_release -cs)
echo "deb [arch=${ARCH} signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian ${CODENAME} stable" > /etc/apt/sources.list.d/docker.list

echo "=== Installing Docker CE CLI + Compose plugin ==="
apt-get update -qq
apt-get install -y docker-ce-cli docker-compose-plugin

echo "=== Installing docker-compose standalone ==="
curl -SL https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo "=== Setting socket permissions ==="
chmod 666 /var/run/docker.sock
usermod -aG docker jenkins

echo "=== Verifying ==="
docker --version
docker-compose --version

echo "ALL DONE!"
