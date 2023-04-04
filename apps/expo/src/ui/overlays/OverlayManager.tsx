/* eslint-disable @typescript-eslint/no-explicit-any */
import { Portal, PortalProvider } from "@gorhom/portal";
import { proxy, useSnapshot } from "valtio";
import { proxyMap } from "valtio/utils";

type OverlayManagerState = {
  id: string;
  visible: boolean;
  props: Record<string, any>;
  show: (props?: object) => void;
  hide: () => void;
};

const OverlayManagerPortalProvider = PortalProvider;

const overlayManagerStore = proxy<Map<string, OverlayManagerState>>(proxyMap());

let uidSeed = 0;
const getUid = () => `_overlay_${uidSeed++}`;
const symbolOverlayId = Symbol("OverlayManagerId");

type ReactFCWithId<P extends object> = React.FC<P> & {
  [symbolOverlayId]: string;
};

const register = <P extends object>(Component: React.ComponentType<P>) => {
  const id = getUid();
  const Overlay = (props: P) => {
    const _props = useSnapshot(overlayManagerStore).get(id)?.props ?? {};
    const mergedProps = { ...props, ..._props };
    return (
      <Portal>
        <Component {...(mergedProps as P)} />
      </Portal>
    );
  };

  Overlay.displayName = `${Component.displayName ?? Component.name ?? id}-Overlay`;
  const OverlayWithId = Object.assign(Overlay, { [symbolOverlayId]: id });

  overlayManagerStore.set(id, {
    id,
    visible: false,
    props: {},
    show: (props: object = {}) => {
      const overlay = overlayManagerStore.get(id);
      if (overlay && !overlay.visible) Object.assign(overlay, { visible: true, props });
    },
    hide: () => {
      const overlay = overlayManagerStore.get(id);
      if (overlay && overlay.visible) Object.assign(overlay, { visible: false });
    },
  });

  return OverlayWithId;
};

const useOverlay = <P extends object>(Component: ReactFCWithId<P>) => {
  const overlayId = getOverlayId(Component);
  const overlay = useSnapshot(overlayManagerStore).get(overlayId);

  if (!overlay) {
    throw new Error("[OverlayManager] An error occurred while trying to get the overlay config. ");
  }

  type IsEmptyObject<Obj extends object> = [keyof Obj] extends [never] ? true : false;

  return {
    id: overlayId,
    visible: overlay.visible,
    show: overlay.show as IsEmptyObject<P> extends false ? (args?: Partial<P>) => void : () => void,
    hide: overlay.hide,
  };
};

const useOverlayAPI = <P extends object>(Component: ReactFCWithId<P>) => {
  const overlayId = getOverlayId(Component);
  const overlay = overlayManagerStore.get(overlayId);

  if (!overlay) {
    throw new Error("[OverlayManager] An error occurred while trying to get the overlay config. ");
  }

  type IsEmptyObject<Obj extends object> = [keyof Obj] extends [never] ? true : false;

  return {
    id: overlayId,
    show: overlay.show as IsEmptyObject<P> extends false ? (args?: Partial<P>) => void : () => void,
    hide: overlay.hide,
  };
};

const getOverlayId = (Component: ReactFCWithId<any>) => {
  if (!Component[symbolOverlayId]) {
    Component[symbolOverlayId] = getUid();
  }
  return Component[symbolOverlayId];
};

export const OverlayManager = {
  register,
  useOverlay,
  useOverlayAPI,
  PortalProvider: OverlayManagerPortalProvider,
};
