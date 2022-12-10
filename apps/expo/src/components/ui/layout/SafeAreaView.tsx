import type { ViewStyle } from 'react-native';
import { SafeAreaView as SAV } from 'react-native-safe-area-context';
import { PortalProvider } from '@gorhom/portal';
import { styled } from 'nativewind';

const SafeAreaViewRoot: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => {
  return (
    <SAV style={style} className="relative flex-1 bg-primary">
      <PortalProvider>{children}</PortalProvider>
    </SAV>
  );
};

export const SafeAreaView = styled(SafeAreaViewRoot);
