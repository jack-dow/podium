import { View } from "react-native";
import { Easing } from "react-native-reanimated";
import { MotiView } from "moti";

interface LoaderProps {
  size?: number;
}

export const Loader: React.FC<LoaderProps> = ({ size = 54 }) => {
  return (
    <View style={{ position: "relative", width: size, height: size }}>
      <MotiView
        from={{
          scale: 0,
          borderRadius: size / 2,
          borderWidth: 0,
          // shadowOpacity: 0.5,
          opacity: 1,
        }}
        animate={{
          scale: 1.5,
          borderRadius: (size + 20) / 2,
          borderWidth: size / 11.5,
          // shadowOpacity: 1,
          opacity: 0,
        }}
        transition={{
          type: "timing",
          easing: Easing.bezier(0.165, 0.84, 0.44, 1),
          duration: 1800,
          delay: 900,
          repeatReverse: false,
          loop: true,
        }}
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size / 11.5,

          borderColor: "#0284c7",
          // shadowColor: "#fff",
          // shadowOffset: { width: 0, height: 1 },
          // shadowOpacity: 1,
          // shadowRadius: 10,
        }}
      />
      <MotiView
        from={{
          scale: 0,
          borderRadius: size / 2,
          borderWidth: 0,
          // shadowOpacity: 0.5,
          opacity: 1,
        }}
        animate={{
          scale: 1.5,
          borderRadius: (size + 20) / 2,
          borderWidth: size / 11.5,
          // shadowOpacity: 1,
          opacity: 0,
        }}
        transition={{
          type: "timing",
          easing: Easing.bezier(0.165, 0.84, 0.44, 1),
          duration: 1800,
          repeatReverse: false,
          loop: true,
        }}
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size / 11.5,
          borderColor: "#0284c7",
          // shadowColor: "#fff",
          // shadowOffset: { width: 0, height: 1 },
          // shadowOpacity: 1,
          // shadowRadius: 10,
        }}
      />
    </View>
  );
};
