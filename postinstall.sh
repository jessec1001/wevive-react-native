#!/bin/sh
npx copy-files-from-to
mkdir node_modules/lib-jitsi-meet
cp lib-jitsi-meet.min.js node_modules/lib-jitsi-meet
rm -rf  node_modules/react-native-chat-plugin/node_modules/react-native-webview/
cp node_modules/react-native-sqlite-storage/package.json node_modules/react-native-sqlite-storage/platforms/package.json