import clsx from 'clsx';
import { MotiView } from 'moti';
import * as React from 'react';
import { Easing } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

export const SpinnerIcon: React.FC<{ className?: string }> = ({ className, ...props }) => (
  <MotiView
    from={{ rotate: '0deg' }}
    animate={{ rotate: '360deg' }}
    transition={{ type: 'timing', loop: true, duration: 1000, easing: Easing.linear, repeatReverse: false }}
  >
    <Svg fill="none" viewBox="0 0 24 24" {...props} className={clsx('h-5 w-5 text-white', className)}>
      <Circle cx={12} cy={12} r={10} stroke="currentColor" />
      <Path
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </Svg>
  </MotiView>
);
