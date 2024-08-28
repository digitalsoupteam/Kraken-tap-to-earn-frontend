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
}

const useWebSocketStore = create<WebSocketState>()(
    devtools((set) => ({
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
    }))
);

export default useWebSocketStore;