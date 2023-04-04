import type { ViewStyle } from "react-native";
import { SafeAreaView as SAV } from "react-native-safe-area-context";
import { styled } from "nativewind";

import { OverlayManager } from "../overlays/OverlayManager";

const SafeAreaViewRoot: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => {
  return (
    <SAV style={style} className="relative flex-1 bg-primary">
      <OverlayManager.PortalProvider>{children}</OverlayManager.PortalProvider>
    </SAV>
  );
};

export const SafeAreaView = styled(SafeAreaViewRoot);
