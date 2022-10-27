import type { SxProp } from 'dripsy';
import { View } from 'dripsy';
import { motify, useDynamicAnimation } from 'moti';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';

const MotiView = motify(View)();

type Props = {
  children?: React.ReactNode;
  /**
   * If `true`, the height will automatically animate to 0. Default: `false`.
   */
  hide?: boolean;
  onHeightDidAnimate?: (height: number) => void;
  /**
   * Defines where the expanded view will be anchored.
   *
   * Default: `top`
   *
   * This prop is untested, use with caution
   */
  enterFrom?: 'bottom' | 'top';
  initialHeight?: number;
  sx?: SxProp;
} & React.ComponentProps<typeof MotiView>;

export function AnimateHeight({
  children,
  hide = false,
  sx,
  delay = Platform.select({ web: 250, default: 0 }),
  transition = { type: 'timing', delay, duration: 75 },
  enterFrom = 'top',
  onHeightDidAnimate,
  initialHeight = 0,
  ...motiViewProps
}: Props) {
  const measuredHeight = useSharedValue(initialHeight);
  const state = useDynamicAnimation(() => {
    return {
      height: initialHeight,
      opacity: !initialHeight || hide ? 0 : 1,
    };
  });
  if ('state' in motiViewProps) {
    console.warn('[AnimateHeight] state prop not supported');
  }

  const animation = useDerivedValue(() => {
    let height = Math.ceil(measuredHeight.value);
    if (hide) {
      height = 0;
    }

    const notVisible = !height || hide;

    state.animateTo({
      height,
      opacity: !height || hide ? 0 : 1,
    });
  }, [hide, measuredHeight]);

  return (
    <MotiView
      {...motiViewProps}
      state={state}
      transition={transition}
      onDidAnimate={
        onHeightDidAnimate &&
        ((key, finished, _, { attemptedValue }) => key === 'height' && onHeightDidAnimate(attemptedValue as number))
      }
      sx={{ overflow: 'hidden', ...sx }}
    >
      <View
        sx={{
          bottom: 'auto',
        }}
        style={[StyleSheet.absoluteFill]}
        onLayout={({ nativeEvent }) => {
          measuredHeight.value = nativeEvent.layout.height;
        }}
      >
        {children}
      </View>
    </MotiView>
  );
}
