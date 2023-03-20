/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from "react";
import { proxy, useSnapshot } from "valtio";

type OverlayManagerState = {
  id: string;
  component: React.FC<any>;
  visible: boolean;
  args: Record<string, any>;
  show: (args?: object) => void;
  onShow: () => void;
  onHide: () => void;
  hide: () => void;
};

type OverlayManagerStore = {
  [key: string]: OverlayManagerState;
};

const overlayManagerStore = proxy<OverlayManagerStore>({});

const OverlayManagerProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <OverlayManagerPlaceholder />
    </>
  );
};

const OverlayManagerPlaceholder = () => {
  const snapshot = useSnapshot(overlayManagerStore);
  const overlays = Object.values(snapshot);

  return (
    <>
      {overlays.map((overlay) => {
        return <overlay.component key={overlay.id} {...overlay.args} />;
      })}
    </>
  );
};

const OverlayManagerIdContext = createContext<string | null>(null);

const useOverlayManagerIdContext = () => {
  const id = useContext(OverlayManagerIdContext);
  if (!id) {
    throw new Error(
      "[OverlayManager] The useOverlayManagerIdContext hook was used outside of an overlay created using the OverlayManager. Please fix this",
    );
  }
  return id;
};

let uidSeed = 0;
const getUid = () => `_overlay_${uidSeed++}`;
const symbolOverlayId = Symbol("OverlayManagerId");

type ReactFCWithId<P extends object> = React.FC<P> & {
  [symbolOverlayId]: string;
};

const register = <P extends object>(Component: React.ComponentType<P>) => {
  const id = getUid();
  const Overlay = (props: P) => {
    return (
      <OverlayManagerIdContext.Provider value={id}>
        <Component {...props} />
      </OverlayManagerIdContext.Provider>
    );
  };

  Overlay.displayName = `${Component.displayName ?? Component.name ?? id}-Overlay`;
  const OverlayWithId = Object.assign(Overlay, { [symbolOverlayId]: id });

  overlayManagerStore[id] = {
    id,
    visible: false,
    component: OverlayWithId,
    args: {},
    onShow: () => {},
    show: (args?: object) => {
      overlayManagerStore[id]!.visible = true;
      if (args) overlayManagerStore[id]!.args = args;
      overlayManagerStore[id]!.onShow();
    },
    onHide: () => {},
    hide: () => {
      overlayManagerStore[id]!.visible = false;
      overlayManagerStore[id]!.onHide();
    },
  };

  return OverlayWithId;
};

const useConfigOverlay = () => {
  const overlayId = useOverlayManagerIdContext();
  const config = useSnapshot(overlayManagerStore)[overlayId];

  if (!config) {
    throw new Error("[OverlayManager] An error occurred while trying to get the overlay config. ");
  }

  const mutableConfig = overlayManagerStore[overlayId]!;

  return {
    id: config.id,
    visible: config.visible,
    onShow: (onShowFn: () => void) => (mutableConfig.onShow = onShowFn),
    onHide: (onHideFn: () => void) => (mutableConfig.onHide = onHideFn),
    hide: config.hide,
  };
};

const useOverlay = <P extends object>(Component: ReactFCWithId<P>) => {
  const overlayId = getOverlayId(Component);
  const config = useSnapshot(overlayManagerStore)[overlayId];

  if (!config) {
    throw new Error("[OverlayManager] An error occurred while trying to get the overlay config. ");
  }

  return {
    visible: config.visible,
    show: config.show as (args: P) => void,
    hide: config.hide,
  };
};

const getOverlayId = (Component: ReactFCWithId<any>) => {
  if (!Component[symbolOverlayId]) {
    Component[symbolOverlayId] = getUid();
  }
  return Component[symbolOverlayId];
};

export const OverlayManager = Object.assign(OverlayManagerProvider, {
  register,
  Provider: OverlayManagerProvider,
  useConfigOverlay,
  useOverlay,
});
