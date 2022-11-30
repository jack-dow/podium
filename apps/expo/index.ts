import { registerRootComponent } from 'expo';
import { NativeWindStyleSheet } from 'nativewind';

import { App } from './src/_app';

NativeWindStyleSheet.setVariables({ '--rem': 16 });
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
