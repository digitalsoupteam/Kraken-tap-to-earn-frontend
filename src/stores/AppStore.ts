import {createStore} from 'zustand/vanilla';

export type AppState = {
    userId: string;
    deviceId: string;
};

export type AppActions = {
    setUserId: (userId: string) => void;
    setDeviceId: (deviceId: string) => void;
};

export type AppStore = AppState & AppActions;

export const defaultInitState: AppState = {
    userId: '',
    deviceId: '',
};

export const createAppStore = (initState: AppState = defaultInitState) => {
    return createStore<AppStore>()(set => ({
        ...initState,
        // @ts-ignore
        setUserId: (userId: string) => set(state => ({userId})),
        // @ts-ignore
        setDeviceId: (deviceId: string) => set(state => ({deviceId})),
    }));
};
