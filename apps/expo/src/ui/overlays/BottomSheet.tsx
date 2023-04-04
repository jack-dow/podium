import { createContext, forwardRef, useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  BackHandler,
  Keyboard,
  type NativeEventSubscription,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
  type ViewProps,
} from "react-native";
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetInternal,
  type BottomSheetBackdropProps,
  type BottomSheetProps as GorhomBottomSheetProps,
} from "@gorhom/bottom-sheet";
import { styled } from "nativewind";

import { Input, type InputProps } from "~/ui/inputs/Input";

const StyledBackdrop = styled(BottomSheetBackdrop);

/**
 * Hook that dismisses the bottom sheet on the hardware back button press if it is visible
 * @param bottomSheetRef ref to the bottom sheet which is going to be closed/dismissed on the back press
 */
const useBottomSheetBackHandler = (bottomSheetRef: React.ForwardedRef<GorhomBottomSheet>) => {
  const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(null);
  const handleSheetPositionChange = useCallback<NonNullable<GorhomBottomSheetProps["onChange"]>>(
    (index) => {
      const isBottomSheetVisible = index >= 0;
      if (isBottomSheetVisible && !backHandlerSubscriptionRef.current) {
        // setup the back handler if the bottom sheet is right in front of the user
        backHandlerSubscriptionRef.current = BackHandler.addEventListener("hardwareBackPress", () => {
          if (bottomSheetRef && typeof bottomSheetRef !== "function") {
            bottomSheetRef.current?.close();
          }
          return true;
        });
      } else if (!isBottomSheetVisible) {
        backHandlerSubscriptionRef.current?.remove();
        backHandlerSubscriptionRef.current = null;
      }
    },
    [bottomSheetRef, backHandlerSubscriptionRef],
  );
  return { handleSheetPositionChange };
};

type BottomSheetProps = {
  children: React.ReactNode;

  /**
   * Initial snap point index, provide `-1` to initiate bottom sheet in closed state.
   * @type number
   * @default -1
   */
  startingIndex?: number;

  /**
   * Points for the bottom sheet to snap to. It accepts array of number, string or mix.
   * String values should be a percentage.
   * @example
   * snapPoints={[200, 500]}
   * snapPoints={[200, '%50']}
   * snapPoints={['%100']}
   * @type Array<string | number>
   */
  snapPoints: GorhomBottomSheetProps["snapPoints"];

  style?: ViewProps["style"];

  hide: () => void;
};

type BottomSheetContextProps = {
  setIsKeyboardShowing: (value: boolean) => void;
};

const BottomSheetContext = createContext<BottomSheetContextProps | null>(null);

const useBottomSheetContext = () => {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error("useBottomSheetContext must be used within a BottomSheetContext");
  }

  return context;
};

const BottomSheetRoot = forwardRef<GorhomBottomSheet, BottomSheetProps>(
  ({ style, snapPoints, children, hide, startingIndex = -1 }, ref) => {
    const [isKeyboardShowing, setIsKeyboardShowing] = useState(false);

    const { handleSheetPositionChange } = useBottomSheetBackHandler(ref);
    const _snapPoints = useMemo(() => snapPoints, [snapPoints]);

    const handleSheetClose = useCallback(() => {
      if (isKeyboardShowing) {
        Keyboard.dismiss();
        setIsKeyboardShowing(false);
      }
      hide();
    }, [isKeyboardShowing, hide]);

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
      return <StyledBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} className="bg-overlay" />;
    }, []);

    return (
      <GorhomBottomSheet
        ref={ref}
        index={startingIndex}
        onClose={handleSheetClose}
        snapPoints={_snapPoints}
        onChange={handleSheetPositionChange}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        style={style}
      >
        <BottomSheetContext.Provider value={{ setIsKeyboardShowing: (value) => setIsKeyboardShowing(value) }}>
          {children}
        </BottomSheetContext.Provider>
      </GorhomBottomSheet>
    );
  },
);
BottomSheetRoot.displayName = "@ui/overlays/BottomSheet";

type BottomSheetContainerProps = {
  children: React.ReactNode;
  /** Change the container to a scroll view instead of the default normal view */
  scrollView?: boolean;
  style?: ViewProps["style"];
};

function BottomSheetContainer({ children, scrollView, style }: BottomSheetContainerProps) {
  if (scrollView) {
    return (
      <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-md" style={style}>
        {children}
      </BottomSheetScrollView>
    );
  }

  return (
    <BottomSheetView className="px-md" style={style}>
      {children}
    </BottomSheetView>
  );
}

function BottomSheetInput({ onFocus, onBlur, ...props }: InputProps) {
  const { setIsKeyboardShowing } = useBottomSheetContext();
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

  const handleInputOnFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = true;
      setIsKeyboardShowing(true);
      if (onFocus) onFocus(e);
    },
    [onFocus, shouldHandleKeyboardEvents, setIsKeyboardShowing],
  );

  const handleInputOnBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = false;
      setIsKeyboardShowing(false);
      if (onBlur) onBlur(e);
    },
    [onBlur, shouldHandleKeyboardEvents, setIsKeyboardShowing],
  );

  return <Input {...props} onFocus={handleInputOnFocus} onBlur={handleInputOnBlur} />;
}

export const BottomSheet = Object.assign(styled(BottomSheetRoot), {
  Container: styled(BottomSheetContainer),
  Input: styled(BottomSheetInput),
  View: styled(BottomSheetView),
  ScrollView: styled(BottomSheetScrollView),
});
