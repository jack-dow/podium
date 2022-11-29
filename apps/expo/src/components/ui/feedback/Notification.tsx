import { Portal } from '@gorhom/portal';
import { Text, View } from 'dripsy';
import { AnimatePresence, motify } from 'moti';
import { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { CloseButton } from '../buttons/CloseButton';
import { CheckCircleIcon } from '@/assets/icons/outline/CheckCircle';

const MotiView = motify(View)();

interface NotificationProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  withCloseButton?: boolean;
  duration?: number | false;
}

interface InternalNotificationProps extends NotificationProps {
  createdAt: number;
  id: number;
  dismiss(): void;
}

const Notification: React.FC<InternalNotificationProps> = ({
  title,
  description,
  icon,
  withCloseButton = true,
  dismiss,
  duration = false,
  ...props
}) => {
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof duration === 'number' && duration !== 0) {
      closeTimeoutRef.current = setTimeout(() => {
        dismiss();
      }, duration);
    }
    return () => {
      closeTimeoutRef.current && clearTimeout(closeTimeoutRef.current);
    };
  }, [dismiss, duration]);

  return (
    <MotiView
      from={{
        opacity: 0,
        translateX: -20,
      }}
      animate={{
        opacity: 1,
        translateX: 0,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        type: 'timing',
        duration: 100,
      }}
      sx={{
        // flex: 1,
        overflow: 'hidden',
        mb: 'sm',
        borderRadius: 'lg',
        bg: 'red',
        boxShadow: 'base',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: 384,
      }}
    >
      <View sx={{ p: 'md' }}>
        <View sx={{ alignItems: description ? 'flex-start' : 'center', flexDirection: 'row' }}>
          <View>
            <CheckCircleIcon sx={{ color: 'icon-positive-light' }} />
          </View>
          <View sx={{ ml: 'md', flex: 1, pt: 2 }}>
            {/* Title */}
            <Text variants={['sm', 'normal']} sx={{ fontWeight: 'medium' }}>
              {title} {props.id}
            </Text>
            {description && (
              <Text variants={['sm', 'muted']} sx={{ mt: 'xs' }}>
                {description}
              </Text>
            )}
          </View>
          {withCloseButton && (
            <View>
              <CloseButton onPress={() => dismiss()} />
            </View>
          )}
        </View>
      </View>
    </MotiView>
  );
};

interface NotificationContextProps {
  notifications: InternalNotificationProps[];
  createNotification: (props: NotificationProps) => void;
}

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  createNotification: () => {},
});

type Action =
  | { type: 'ADD_NOTIFICATION'; notification: InternalNotificationProps }
  | { type: 'DISMISS_NOTIFICATION'; notificationId: number };

const reducer = (state: InternalNotificationProps[], action: Action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [...state, action.notification];
    case 'DISMISS_NOTIFICATION':
      return state.filter((notification) => notification.id !== action.notificationId);
    default:
      return state;
  }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, dispatch] = useReducer(reducer, []);
  const [nextId, setNextId] = useState(0);

  const createNotification = (props: NotificationProps) => {
    const id = nextId;
    const newNotification: InternalNotificationProps = {
      id,
      dismiss: () => dispatch({ type: 'DISMISS_NOTIFICATION', notificationId: id }),
      createdAt: Date.now(),
      ...props,
    };
    setNextId((currId) => (currId += 1));
    dispatch({ type: 'ADD_NOTIFICATION', notification: newNotification });
  };

  return (
    <NotificationContext.Provider value={{ notifications, createNotification }}>
      {children}
      {notifications.length > 0 && (
        <View sx={{ bg: 'black', mx: ['md', 'lg', null], my: ['md', 'lg', null] }}>
          <AnimatePresence>
            {notifications.map((notification) => {
              return <Notification key={notification.id} {...notification} />;
            })}
          </AnimatePresence>
        </View>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  return context;
};
