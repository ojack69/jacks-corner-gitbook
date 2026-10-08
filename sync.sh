#!/bin/bash
NOTES_ROOT="$(cat .notes_root)"
for f in $(ls "$NOTES_ROOT")
do
    rm -rf "./$f"
done

cp -r "$NOTES_ROOT"/* ./
while read -r f; do rm -rf "./$f"; done < .banned

./autocommit.sh
