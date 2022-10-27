import { Text, View, styled, useSx } from 'dripsy';
import React, { useMemo } from 'react';
import { MotiPressable } from 'moti/interactions';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../buttons/Button';
import { Anchor } from '../navigation/Anchor';

interface LayoutProps {
  children?: React.ReactNode;
  title: string;
  titleRightSection?: React.ReactNode;
  description: string;
  removePadding?: boolean;
}

const DripsyMotiPressable = styled(MotiPressable)();

export const Layout: React.FC<LayoutProps> = ({ children, title, description, titleRightSection, removePadding }) => {
  const sx = useSx();
  const navigation = useNavigation();
  return (
    <View sx={{ position: 'relative', flex: 1, pt: 'md', pb: 'xl' }}>
      <View sx={{ px: ['md', null, 'lg'] }}>
        <View sx={{ width: '100%', flexDirection: 'row', alignItems: 'center', mb: 'sm' }}>
          <DripsyMotiPressable
            sx={{
              width: 42,
              height: 42,
              ml: -6,
              mb: -6,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.goBack()}
            transition={{ type: 'timing', duration: 100 }}
            animate={useMemo(
              () =>
                ({ pressed }) => {
                  'worklet';
                  return {
                    opacity: pressed ? 1 : 0.83, // tried to get it as close as possible to icon-normal
                  };
                },
              [],
            )}
          >
            <Svg width={36} height={36} fill="none" style={sx({ stroke: 'icon-active' })}>
              <Path
                d="M13.875 7.125 7.125 13.5l6.75 6.375"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M8.25 13.5h14.625a6 6 0 0 1 6 6v9.375"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </DripsyMotiPressable>
          <View sx={{ width: 20, height: 20 }} />
        </View>

        <View sx={{ pb: 'md', borderColor: 'divider', borderBottomWidth: 1, mb: 'md' }}>
          <View sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variants={['2xl', 'normal']} sx={{ fontWeight: 'medium' }}>
              {title}
            </Text>

            {titleRightSection}
          </View>

          <Text variants={['sm', 'muted']} sx={{ mt: 'sm' }}>
            {description}
          </Text>
        </View>
      </View>
      <View sx={{ px: removePadding ? 0 : ['md', null, 'lg'], flex: 1 }}>{children}</View>
    </View>
  );
};
