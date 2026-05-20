#!/bin/bash
set -e
echo "Building Docusaurus site..."
npm install
npm run build
echo "Build completed successfully!"
