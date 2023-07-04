#!/bin/bash

if [ -d "node_modules" ]; then
  echo "[WAITING⌛]: Removing root node_modules directory"
  rm -rf node_modules
  echo "[SUCESS ✅]: Removed root node_modules directory"
  exit 0
else
  echo "[ERROR 🥅]: Directory 'node_modules' does not exists."
  exit 1
fi
