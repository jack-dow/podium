/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";
import { proxy, useSnapshot } from "valtio";

type OverlayManagerState = {
  id: string;
  component: React.FC<any>;
  visible: boolean;
  args: Record<string, any>;
  show: (args?: object) => void;
  hide: () => void;
};

type OverlayManagerStore = {
  [key: string]: OverlayManagerState;
};

const overlayManagerStore = proxy<OverlayManagerStore>({});
// Used to prevent unnecessary re-render of all overlays when one overlay's props are changed
const overlayManagerIdStore = proxy<Array<string>>([]);

const OverlayManagerProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <OverlayManagerPlaceholder />
    </>
  );
};

const OverlayManagerPlaceholder = () => {
  const overlayIds = useSnapshot(overlayManagerIdStore);

  return (
    <>
      {overlayIds.map((overlayId) => {
        return <OverlayManagerPlaceholderComponent key={overlayId} overlayId={overlayId} />;
      })}
    </>
  );
};

const OverlayManagerPlaceholderComponent = ({ overlayId }: { overlayId: string }) => {
  const snapshot = useSnapshot(overlayManagerStore);
  const overlay = snapshot[overlayId];

  console.log("Rendering from overlay:", overlayId);

  if (!overlay) {
    throw new Error("[OverlayManager] Could not find overlay with id: " + overlayId);
  }

  return <overlay.component {...overlay.args} />;
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

  overlayManagerIdStore.push(id);
  overlayManagerStore[id] = {
    id,
    visible: false,
    component: OverlayWithId,
    args: {},
    show: (args?: object) => {
      overlayManagerStore[id]!.visible = true;
      if (args) overlayManagerStore[id]!.args = args;
    },
    hide: () => {
      overlayManagerStore[id]!.visible = false;
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

  return {
    id: config.id,
    visible: config.visible,
    hide: config.hide,
  };
};

const useOverlay = <P extends object>(Component: ReactFCWithId<P>) => {
  const overlayId = getOverlayId(Component);
  const config = useSnapshot(overlayManagerStore)[overlayId];

  if (!config) {
    throw new Error("[OverlayManager] An error occurred while trying to get the overlay config. ");
  }

  type IsEmptyObject<Obj extends object> = [keyof Obj] extends [never] ? true : false;

  return {
    visible: config.visible,
    show: config.show as IsEmptyObject<P> extends false ? (args: P) => void : () => void,
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
