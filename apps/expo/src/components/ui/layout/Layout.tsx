import React, { useMemo } from 'react';
import { MotiPressable } from 'moti/interactions';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { Button } from '../buttons/Button';
import { Anchor } from '../navigation/Anchor';
import { useTheme } from '@/themes';
import { responsive } from '@/responsive';

interface LayoutProps {
  children?: React.ReactNode;
  title: string;
  titleRightSection?: React.ReactNode;
  description: string;
  removePadding?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, description, titleRightSection, removePadding }) => {
  const { spacing, colors, borderWeights, fontWeights, fontSizes } = useTheme();
  const navigation = useNavigation();
  return (
    <View style={{ position: 'relative', flex: 1, paddingBottom: spacing.base }}>
      <View style={{ paddingHorizontal: responsive({ base: spacing.base, md: spacing.lg }) }}>
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
          <MotiPressable
            style={{
              width: 42,
              height: 42,
              marginLeft: -6,
              marginBottom: -6,
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
            <Svg width={36} height={36} fill="none">
              <Path
                d="M13.875 7.125 7.125 13.5l6.75 6.375"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke={colors.icon.primary.active}
              />
              <Path
                d="M8.25 13.5h14.625a6 6 0 0 1 6 6v9.375"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke={colors.icon.primary.active}
              />
            </Svg>
          </MotiPressable>
          <View style={{ width: 20, height: 20 }} />
        </View>

        <View
          style={{
            paddingBottom: spacing.base,
            borderColor: colors.border.primary.normal,
            borderBottomWidth: borderWeights.light,
            marginBottom: spacing.base,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text
              style={{ fontWeight: fontWeights.medium, fontSize: fontSizes['2xl'], color: colors.text.primary.normal }}
            >
              {title}
            </Text>

            {titleRightSection}
          </View>

          <Text style={{ marginTop: spacing.sm, fontSize: fontSizes.sm, color: colors.text.primary.muted }}>
            {description}
          </Text>
        </View>
      </View>
      <View
        style={{ paddingHorizontal: removePadding ? 0 : responsive({ base: spacing.base, md: spacing.lg }), flex: 1 }}
      >
        {children}
      </View>
    </View>
  );
};
