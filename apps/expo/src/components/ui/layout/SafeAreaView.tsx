import { SafeAreaView as SAV } from 'react-native-safe-area-context';
import { PortalProvider } from '@gorhom/portal';
import type { StylesAsProp } from 'react-native';
import { useTheme } from '@/themes';

export const SafeAreaView: React.FC<{ children: React.ReactNode; style?: StylesAsProp }> = ({ children, style }) => {
  const theme = useTheme();
  return (
    <SAV
      style={[
        {
          backgroundColor: theme.colors.background.primary,
          height: '100%',
          position: 'relative',
          flex: 1,
        },
        style,
      ]}
    >
      <PortalProvider>{children}</PortalProvider>
    </SAV>
  );
};
