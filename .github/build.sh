#!/usr/bin/env bash
# Builds the Windows installer (dist/Smart21network-Setup-<version>.exe).
# On Linux or macOS this needs Wine (32-bit support) for the NSIS installer step.
set -e
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "Install Node.js (LTS) first: https://nodejs.org"; exit 1; }
npm install --no-audit --no-fund
npm run dist:win
ls -l dist/*.exe
