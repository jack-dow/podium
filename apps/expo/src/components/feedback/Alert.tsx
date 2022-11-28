import React, { createContext, useContext } from 'react';
import type { StylesAsProp } from 'react-native';
import { Text, View } from 'react-native';
import { XCircleIcon } from '@/assets/icons/solid/XCircle';
import { CheckCircleIcon } from '@/assets/icons/solid/CheckCircle';
import { ExclamationTriangleIcon } from '@/assets/icons/solid/ExclamationTriangle';
import { useTheme } from '@/themes';

type AlertTypes = 'positive' | 'warning' | 'danger' | 'info';

interface AlertProps {
  type?: AlertTypes;
  title?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  style?: StylesAsProp;
}

const AlertContext = createContext<{ type: AlertTypes }>({
  type: 'danger',
});

const AlertRoot: React.FC<AlertProps> = ({ type = 'danger', title, children, icon, style }) => {
  const { colors, spacing, radii, fontWeights, fontSizes } = useTheme();
  return (
    <AlertContext.Provider value={{ type }}>
      <View
        style={[
          {
            borderRadius: radii.md,
            backgroundColor: colors.background[type],
            padding: spacing.base,
            flexDirection: 'row',
          },
          style,
        ]}
      >
        <View style={{ marginTop: -2 }}>
          {icon || (
            <>
              {type === 'positive' && <CheckCircleIcon variant="positive" />}
              {type === 'warning' && <ExclamationTriangleIcon variant="warning" />}
              {type === 'danger' && <XCircleIcon variant="danger" />}
            </>
          )}
        </View>
        <View style={{ marginLeft: spacing.md }}>
          <Text style={{ fontWeight: fontWeights.medium, fontSize: fontSizes.sm, color: colors.text[type].normal }}>
            {title}
          </Text>
          <View style={{ marginTop: spacing.sm }}>{children}</View>
        </View>
      </View>
    </AlertContext.Provider>
  );
};

const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fontSizes, colors } = useTheme();
  const { type } = useContext(AlertContext);
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={{ fontSize: fontSizes.sm, color: colors.text[type].muted }}>{'\u2022'}</Text>
      <Text style={{ fontSize: fontSizes.sm, color: colors.text[type].muted, paddingLeft: 10 }}>{children}</Text>
    </View>
  );
};

const Description: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fontSizes, colors } = useTheme();
  const { type } = useContext(AlertContext);
  return <Text style={{ fontSize: fontSizes.sm, color: colors.text[type].normal }}>{children}</Text>;
};

export const Alert = Object.assign(AlertRoot, { ListItem, Description });
