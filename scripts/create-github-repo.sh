#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="${1:-saboratarekareka}"
OWNER="SaborataRekaReka"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI не найден. Установите gh или создайте репозиторий вручную на GitHub."
  exit 1
fi

git init
 git add .
 git commit -m "Initial Chatium quiz project scaffold"
 gh repo create "$OWNER/$REPO_NAME" --private --source=. --remote=origin --push
