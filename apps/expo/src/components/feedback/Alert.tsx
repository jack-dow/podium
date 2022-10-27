import type { SxProp } from 'dripsy';
import { Text, View } from 'dripsy';
import React, { createContext, useContext } from 'react';
import { XCircleIcon } from '@/assets/icons/solid/XCircle';
import { CheckCircleIcon } from '@/assets/icons/solid/CheckCircle';
import { ExclamationTriangleIcon } from '@/assets/icons/solid/ExclamationTriangle';

type AlertTypes = 'positive' | 'warning' | 'danger' | 'info';

interface AlertProps {
  type?: AlertTypes;
  title?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  sx?: SxProp;
}

const AlertContext = createContext<{ type: AlertTypes }>({
  type: 'danger',
});

const AlertRoot: React.FC<AlertProps> = ({ type = 'danger', title, children, icon, sx }) => {
  return (
    <AlertContext.Provider value={{ type }}>
      <View sx={{ borderRadius: 'md', bg: `background-${type}`, p: 'md', flexDirection: 'row', ...sx }}>
        <View sx={{ mt: -2 }}>
          {icon || (
            <>
              {type === 'positive' && <CheckCircleIcon sx={{ color: `icon-${type}-light` }} />}
              {type === 'warning' && <ExclamationTriangleIcon sx={{ color: `icon-${type}-light` }} />}
              {type === 'danger' && <XCircleIcon sx={{ color: `icon-${type}-light` }} />}
            </>
          )}
        </View>
        <View sx={{ ml: 12 }}>
          <Text variants={['sm', `${type}-normal`]} sx={{ fontWeight: 'medium' }}>
            {title}
          </Text>
          <View sx={{ mt: 'sm' }}>{children}</View>
        </View>
      </View>
    </AlertContext.Provider>
  );
};

const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { type } = useContext(AlertContext);
  return (
    <View sx={{ flexDirection: 'row' }}>
      <Text variants={['sm', `${type}-muted`]}>{'\u2022'}</Text>
      <Text variants={['sm', `${type}-muted`]} sx={{ pl: 10 }}>
        {children}
      </Text>
    </View>
  );
};

const Description: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { type } = useContext(AlertContext);
  return <Text variants={['sm', `${type}-normal`]}>{children}</Text>;
};

export const Alert = Object.assign(AlertRoot, { ListItem, Description });
