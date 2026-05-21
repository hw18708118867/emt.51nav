#!/bin/sh

set -eu

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
OUT_DIR="$REPO_ROOT/out"
PUBLISH_DIR="$REPO_ROOT/.deploy-gh-pages"
REMOTE_URL=$(git -C "$REPO_ROOT" config --get remote.origin.url)

if [ ! -d "$OUT_DIR" ]; then
  echo "Missing $OUT_DIR. Run npm run pages:build first." >&2
  exit 1
fi

rm -rf "$PUBLISH_DIR"
mkdir -p "$PUBLISH_DIR"
cp -R "$OUT_DIR"/. "$PUBLISH_DIR"/

git -C "$PUBLISH_DIR" init -b gh-pages >/dev/null
git -C "$PUBLISH_DIR" remote add origin "$REMOTE_URL"
git -C "$PUBLISH_DIR" add .

if git -C "$PUBLISH_DIR" diff --cached --quiet; then
  echo "Nothing to publish."
  exit 0
fi

git -C "$PUBLISH_DIR" commit -m "Deploy GitHub Pages" >/dev/null
git -C "$PUBLISH_DIR" push --force origin gh-pages

