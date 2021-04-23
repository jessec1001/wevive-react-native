Known issues:

If iOS fails to build because of AccessibilityResources, go to 
ios/Pods/Target Support Files/Pods-JitsiMeet/Pods-JitsiMeet-resources.sh
and comment out
install_resource "${PODS_CONFIGURATION_BUILD_DIR}/React-Core.common/AccessibilityResources.bundle"
