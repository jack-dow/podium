import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Easing } from 'react-native-reanimated';
import { Portal } from '@gorhom/portal';
import { MotiView } from 'moti';
import type { SxProp } from 'dripsy';
import { Pressable, Text, View } from 'dripsy';
import { ChevronRightIcon } from '@/assets/icons/mini/ChevronRight';
import { Label } from '@/components/inputs/Label';
import { AnimateHeight } from '@/components/utils/AnimateHeight';
import { Checkbox } from '@/components/inputs/Checkbox';

export const MuscleSelectBottomSheet = forwardRef<BottomSheet, {}>((props, ref) => {
  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // renders
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    [],
  );
  return (
    <Portal>
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
      >
        <BottomSheetView>
          <View sx={{ p: 'md' }}>
            <Label>Select the main muscle for this exercise:</Label>

            <ToggleableItem title="Upper body" defaultOpen>
              <ToggleableItem title="Shoulders" nested sx={{ pb: 'sm' }}>
                <View sx={{ pl: 'md' }}>
                  <Checkbox checked label="Front Delts" styles={{ wrapper: { pb: 'sm' } }} />
                  <Checkbox checked label="Side Delts" styles={{ wrapper: { pb: 'sm' } }} />
                  <Checkbox checked label="Rear Delts" styles={{ wrapper: { pb: 'sm' } }} />
                </View>
              </ToggleableItem>
              <ToggleableItem title="Arms" nested>
                <View sx={{ pl: 'md' }}>
                  <Checkbox checked label="Biceps" styles={{ wrapper: { pb: 'sm' } }} />
                  <Checkbox checked label="Forearms" styles={{ wrapper: { pb: 'sm' } }} />
                  <Checkbox checked label="Triceps" styles={{ wrapper: { pb: 'sm' } }} />
                </View>
              </ToggleableItem>
            </ToggleableItem>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
});

MuscleSelectBottomSheet.displayName = 'MuscleSelectBottomSheet';

interface ToggleableItemProps {
  title: string;
  titleRight?: React.ReactNode;
  nested?: boolean;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  sx?: SxProp;
}

const ToggleableItem: React.FC<ToggleableItemProps> = ({
  title,
  titleRight,
  defaultOpen = false,
  children,
  sx,
  nested,
}) => {
  const [show, toggle] = React.useReducer((open) => !open, defaultOpen);

  return (
    <View sx={{ width: '100%', ...sx }}>
      <View>
        <Pressable
          onPress={toggle}
          sx={{
            py: nested ? 'sm' : 'md',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {nested ? (
            <Checkbox checked={show} onPress={toggle} />
          ) : (
            <MotiView
              animate={{ rotateZ: show ? '90deg' : '0deg' }}
              transition={{
                type: 'timing',
                duration: 100,
                easing: Easing.ease,
              }}
            >
              <ChevronRightIcon sx={{ color: 'black' }} />
            </MotiView>
          )}

          <Text selectable={false} variants={['normal', 'base']} sx={{ pl: 'sm' }}>
            {title}
          </Text>
        </Pressable>
      </View>
      <AnimateHeight enterFrom="bottom" hide={!show}>
        <View sx={{ borderLeftWidth: 1, borderLeftColor: 'border-primary', ml: 10, pl: 'md' }}>
          <View sx={{ ml: 10 }}>{children}</View>
        </View>
      </AnimateHeight>
    </View>
  );
};
