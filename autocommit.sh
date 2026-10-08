#!/bin/bash
git pull

git add .
git commit -m "auto_deploy_$(date +%s)"
git push

