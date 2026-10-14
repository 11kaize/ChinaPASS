#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
bundled_node="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin"
if [[ -x "$bundled_node/node" ]]; then export PATH="$bundled_node:$PATH"; fi
toolchain="$HOME/.cache/chinahand-native"
if [[ -z "${JAVA_HOME:-}" && -d "$toolchain/jdk-21.0.12.1" ]]; then export JAVA_HOME="$toolchain/jdk-21.0.12.1"; fi
if [[ -z "${ANDROID_HOME:-}" && -d "$toolchain/android-sdk" ]]; then export ANDROID_HOME="$toolchain/android-sdk"; fi
: "${JAVA_HOME:?Set JAVA_HOME to JDK 17 or newer}"
: "${ANDROID_HOME:?Set ANDROID_HOME to your Android SDK}"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
npx expo prebuild --platform android --no-install
if [[ -x "$toolchain/gradle/bin/gradle" ]]; then gradle_command="$toolchain/gradle/bin/gradle"; else gradle_command='./gradlew'; fi
(cd android && "$gradle_command" :app:assembleRelease -PreactNativeArchitectures=arm64-v8a,x86_64 --max-workers=8)
mkdir -p ../artifacts
cp android/app/build/outputs/apk/release/app-release.apk ../artifacts/ChinaHand-demo.apk
echo 'Native demo APK: artifacts/ChinaHand-demo.apk (demo signing key, not an app-store build).'
