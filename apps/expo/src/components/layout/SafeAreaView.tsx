import type { SxProp } from 'dripsy';
import { SafeAreaView as DripsySAV } from 'dripsy';
import { Platform, StatusBar } from 'react-native';

export const SafeAreaView: React.FC<{ children: React.ReactNode; sx?: SxProp }> = ({ sx, children }) => {
  return (
    <DripsySAV
      sx={{
        bg: 'background-primary',
        height: '100%',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        ...sx,
      }}
    >
      {children}
    </DripsySAV>
  );
};
