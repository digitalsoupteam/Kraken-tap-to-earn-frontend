import create from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
    isWalletConnectOpened: boolean;
}

type Action = {
    openWalletConnect: () => void;
    closeWalletConnect: () => void;
}

const useModalStore = create<State & Action>()(
    devtools((set) => ({
        isWalletConnectOpened: false,
        openWalletConnect: () => set({ isWalletConnectOpened: true }),
        closeWalletConnect: () => set({ isWalletConnectOpened: false }),
    }))
);

export default useModalStore;
