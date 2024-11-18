import {create} from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
    isWalletConnectOpened: boolean;
    isSettingsOpened: boolean;
}

type Action = {
    openWalletConnect: () => void;
    closeWalletConnect: () => void;
    openSettings: () => void;
    closeSettings: () => void;
}

const useModalStore = create<State & Action>()(
    devtools((set) => ({
        isWalletConnectOpened: false,
        openWalletConnect: () => set({ isWalletConnectOpened: true }),
        closeWalletConnect: () => set({ isWalletConnectOpened: false }),
        isSettingsOpened: false,
        openSettings: () => set({ isSettingsOpened: true }),
        closeSettings: () => set({ isSettingsOpened: false }),
    }))
);

export default useModalStore;
