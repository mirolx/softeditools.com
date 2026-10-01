#!/bin/sh
# Builds the React landing page and assembles the deployable site into ./public-out
set -e
(cd landing && npm ci && npm run build)
rm -rf public-out && mkdir public-out
for f in *; do
  case "$f" in landing|public-out|scripts/build.sh|index.html|node_modules) ;; *) cp -R "$f" public-out/ ;; esac
done
cp -R landing/dist/. public-out/
