#!/usr/bin/env bash
set -euo pipefail

node esbuild.build.js
rsync -av --delete dist/ /var/www/recipes.stxalq.dev/
echo "Deployed to /var/www/recipes.stxalq.dev"
