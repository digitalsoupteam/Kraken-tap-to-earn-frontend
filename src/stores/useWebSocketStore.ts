import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { ReadyState } from 'react-use-websocket';

const connectionStatuses: Record<ReadyState, string> = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
};

interface WebSocketState {
    sendMessage: (message: string) => void;
    messages: string[];
    lastMessage: string | null;
    setLastMessage: (message: string) => void;
    connectionStatus: string;
    readyState: ReadyState;
    setMessages: (messages: string[]) => void;
    setReadyState: (state: ReadyState) => void;
    setSendMessage: (sendMessage: (message: string) => void) => void;
    jwt: string;
    setJwt: (jwt: string) => void;
    getUser: () => void;
    getTopUsers: () => void;
}

const getLocalJwt = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('jwt') || '';
    }

    return '';
};

const useWebSocketStore = create<WebSocketState>()(
    devtools((set, get) => ({
        sendMessage: () => {},
        messages: [],
        lastMessage: null,
        setLastMessage: (message) => set({ lastMessage: message }),
        connectionStatus: 'Disconnected',
        readyState: ReadyState.CLOSED,
        setMessages: (messages) => set({ messages }),
        setReadyState: (state) =>
            set({
                readyState: state,
                connectionStatus: connectionStatuses[state],
            }),
        setSendMessage: (sendMessage) => set({ sendMessage }),
        jwt: getLocalJwt(),
        setJwt: (jwt) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('jwt', jwt);
            }
            set({ jwt });
        },
        getUser: () => {
            const message = {
                jsonrpc: '2.0',
                id: 1000,
                method: 'getUser',
            };

            const sendMessage = get().sendMessage;

            sendMessage(JSON.stringify(message));
        },
        getTopUsers: () => {
            const message = {
                jsonrpc: '2.0',
                id: 3000,
                method: 'getTopUsers',
                params: {
                    limit: 15,
                }
            };

            const sendMessage = get().sendMessage;

            sendMessage(JSON.stringify(message));
        },
    }))
);

export default useWebSocketStore;
