import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { styled } from 'nativewind';

import clsx from 'clsx';
import { Text } from '../typography/Text';

const bottomNavigationLinks = {
  Home: {
    icon: <Text>Home</Text>,
    label: 'Home',
    screen: 'Home',
  },
  Exercises: {
    icon: <Text>Exercises</Text>,
    label: 'Exercises',
    screen: 'Exercises',
  },
  Templates: {
    icon: <Text>Templates</Text>,
    label: 'Templates',
    screen: 'Templates',
  },
};

interface BottomNavigationProps {
  style?: ViewProps['style'];
}

const BottomNavigationRoot: React.FC<BottomNavigationProps> = () => {
  return (
    <View>
      <View>
        <Text>Bottom nav</Text>
      </View>
    </View>
  );
};

interface BottomNavigationButtonProps {
  id: keyof typeof bottomNavigationLinks;
  isSelected: boolean;
  style?: ViewProps['style'];
}

const BottomNavigationButtonRoot: React.FC<BottomNavigationButtonProps> = ({ id, isSelected, style }) => {
  const { icon: Icon, label, screen } = bottomNavigationLinks[id];
  return (
    <View className="relative items-center bg-transparent" style={style}>
      <View className="items-center justify-center rounded-2xl">
        {/* <Icon /> */}
        <Text
          weight="medium"
          className={clsx('text-sm', isSelected ? 'text-interactive-primary-normal' : 'text-primary-muted')}
        >
          {label}
        </Text>
      </View>
    </View>
  );
};

const BottomNavigationButton = styled(BottomNavigationButtonRoot);

export const BottomNavigation = styled(BottomNavigationRoot);
