#!/bin/bash

MESSAGE=`git log -1 --pretty=%B`
echo $MESSAGE
firebase appdistribution:distribute ./android/app/build/outputs/apk/release/app-release.apk \
--app 1:684342741259:android:f815e1b47667aaac26fa0e \
--release-notes "$MESSAGE" --testers-file testers.txt