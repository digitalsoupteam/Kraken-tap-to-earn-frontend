import create from 'zustand';
import {devtools} from 'zustand/middleware';
import {ReadyState} from 'react-use-websocket';

const connectionStatuses: Record<ReadyState, string> = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
};

type State = {
    messages: string[];
    lastMessage: string | null;
    connectionStatus: string;
    readyState: ReadyState;
    jwt: string;
}

type Action = {
    sendMessage: (message: string) => void;
    setLastMessage: (message: string) => void;
    setMessages: (messages: string[]) => void;
    setReadyState: (state: ReadyState) => void;
    setSendMessage: (sendMessage: (message: string) => void) => void;
    getJwt: (initData: string) => void;
    setJwt: (jwt: string) => void;
    getUser: () => void;
    getTopUsers: () => void;
    getTopReferrals: () => void;
    updateProfile: (data: {
        nickname?: string;
        wallet?: string;
    }) => void;
}


const getLocalJwt = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('jwt') || '';
    }

    return '';
};

const useWebSocketStore = create<State & Action>()(
    devtools((set, get) => ({
        messages: [],
        lastMessage: null,
        connectionStatus: 'Disconnected',
        readyState: ReadyState.CLOSED,
        jwt: getLocalJwt(),
        sendMessage: () => {},
        setLastMessage: (message) => set({lastMessage: message}),
        setMessages: (messages) => set({messages}),
        setReadyState: (state) =>
            set({
                readyState: state,
                connectionStatus: connectionStatuses[state],
            }),
        setSendMessage: (sendMessage) => set({sendMessage}),
        getJwt: async  (initData: string) => {
            console.log('[LOG]: GetJwt call');
            const url = initData ? 'https://game.releasethekraken.io/backend/api/telegram_session' : 'https://game.releasethekraken.io/backend/api/anonymous_session';
            const referrerId = initData && new URLSearchParams(initData).get('start_param');

            const maxRetries = 10;
            let attempts = 0;

            const fetchJwt = async () => {
                try {
                    console.log(`[LOG]: Connection attempt #${attempts}`);
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ...(referrerId && { referrer_id: referrerId }),
                            ...(initData && { initData: initData }),
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    const jwtToken = data.jwt;

                    if (jwtToken) {
                        get().setJwt(jwtToken);
                        return jwtToken;
                    } else {
                        throw new Error('No JWT token received');
                    }
                } catch (error) {
                    console.error('Attempt:', attempts + 1, 'Error:', error);
                    attempts++;
                    if (attempts < maxRetries) {
                        return null;
                    } else {
                        throw new Error('All attempts to fetch JWT failed.');
                    }
                }
            };

            return new Promise((resolve, reject) => {
                const attemptFetch = async () => {
                    try {
                        const jwtToken = await fetchJwt();
                        if (jwtToken) {
                            resolve(jwtToken);
                        } else {
                            const interval = setInterval(async () => {
                                try {
                                    const retryJwtToken = await fetchJwt();
                                    if (retryJwtToken) {
                                        clearInterval(interval);
                                        resolve(retryJwtToken);
                                    }
                                } catch (error) {
                                    if (attempts >= maxRetries) {
                                        clearInterval(interval);
                                        console.error('All attempts to fetch JWT failed.');
                                        reject(new Error('All attempts to fetch JWT failed.'));
                                        alert('Connection error. Please try again later');
                                    }
                                }
                            }, 5000);
                        }
                    } catch (error) {
                        reject(error);
                    }
                };

                attemptFetch();
            });
        },
        setJwt: (jwt) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('jwt', jwt);
            }
            set({jwt});
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
                    limit: 100,
                }
            };

            const sendMessage = get().sendMessage;
            sendMessage(JSON.stringify(message));
        },
        getTopReferrals: () => {
            const message = {
                jsonrpc: '2.0',
                id: 4000,
                method: 'getTopReferrals',
                params: {
                    limit: 100,
                }
            };

            const sendMessage = get().sendMessage;

            sendMessage(JSON.stringify(message));
        },
        updateProfile: (
            data
        ) => {
            console.log(data);
            const message = {
                jsonrpc: '2.0',
                id: data.wallet ? 5001 : 5000,
                method: 'updateProfile',
                params: {
                    ...(data.nickname && {nickname: data.nickname}),
                    ...(data.wallet && {wallet: data.wallet}),
                }
            };

            const sendMessage = get().sendMessage;

            sendMessage(JSON.stringify(message));
        },
    }))
);

export default useWebSocketStore;
