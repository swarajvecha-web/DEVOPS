#!/bin/bash
# Run this script ONCE on your Jenkins EC2 server as root (sudo bash fix_jenkins_docker.sh)
set -e

echo "=== Step 1: Add jenkins user to docker group ==="
usermod -aG docker jenkins

echo "=== Step 2: Fix docker socket permissions immediately ==="
chmod 666 /var/run/docker.sock

echo "=== Step 3: Allow jenkins to run chmod on docker.sock without password ==="
SUDOERS_LINE="jenkins ALL=(ALL) NOPASSWD: /bin/chmod 666 /var/run/docker.sock"
SUDOERS_FILE="/etc/sudoers.d/jenkins-docker"

if ! grep -qF "$SUDOERS_LINE" "$SUDOERS_FILE" 2>/dev/null; then
    echo "$SUDOERS_LINE" > "$SUDOERS_FILE"
    chmod 440 "$SUDOERS_FILE"
    echo "Sudoers rule added: $SUDOERS_FILE"
else
    echo "Sudoers rule already exists, skipping."
fi

echo "=== Step 4: Restart Jenkins to apply group changes ==="
systemctl restart jenkins

echo ""
echo "ALL DONE! Jenkins can now use Docker."
echo "Re-trigger your Jenkins pipeline now."
