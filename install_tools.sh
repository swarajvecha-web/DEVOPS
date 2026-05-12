#!/bin/bash
set -e

echo "=== Installing AWS CLI ==="
curl -fsSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o /tmp/awscliv2.zip
apt-get install -y unzip 2>/dev/null || true
unzip -q /tmp/awscliv2.zip -d /tmp/
/tmp/aws/install --update
aws --version

echo "=== Installing kubectl ==="
curl -fsSL "https://dl.k8s.io/release/$(curl -fsSL https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" -o /usr/local/bin/kubectl
chmod +x /usr/local/bin/kubectl
kubectl version --client

echo "=== Fixing Docker socket permissions ==="
chmod 666 /var/run/docker.sock

echo "=== ALL TOOLS INSTALLED ==="
