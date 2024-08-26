'use client';

import {useAppStore} from '@/providers/AppStoreProvider';
import WebApp from '@twa-dev/sdk';
import {FC, PropsWithChildren, useEffect} from 'react';
import useWebSocket from 'react-use-websocket';

const StoreInit: FC<PropsWithChildren> = ({children}) => {
    const {deviceId, setDeviceId, setUserId} = useAppStore(state => state);

    const {sendMessage, lastMessage, readyState} = useWebSocket(
        process.env.NEXT_PUBLIC_WS_URL ?? 'wss://172.86.75.111:3000/ws',
        {share: true}
    );

    // TG WebApp
    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
            console.log(`[LOG]: WebApp ready!`);
        }
    }, []);

    // Debug WS connectin status
    useEffect(() => {
        const wsStatuses = [
            'UNINSTANTIATED',
            'CONNECTING',
            'OPEN',
            'CLOSING',
            'CLOSED',
        ];
        console.log(`[LOG]: WS status ${wsStatuses[readyState + 1]}!`);
    }, [readyState]);

    // Initial get or create device id
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const telegramInitData = WebApp.initData;
            const savedDeviceId = window.localStorage['deviceId'];
            const _deviceId = telegramInitData
                ? WebApp.initData
                : savedDeviceId
                ? savedDeviceId
                : self.crypto.randomUUID();
            console.log(`[LOG]: Set device id ${_deviceId}!`);
            setDeviceId(_deviceId);
        }
    }, []);

    // If deviceId updated, save to local storage and initUser
    useEffect(() => {
        window.localStorage['deviceId'] = deviceId;

        if (!deviceId) return;

        const message = {
            jsonrpc: '2.0',
            id: 1,
            method: 'initUser',
            params: {
                userId: deviceId,
            },
        };
        console.log(`[LOG]: Call initUser method, with data:`, message);
        sendMessage(JSON.stringify(message));
    }, [deviceId, sendMessage]);

    // Receive initUser responce
    useEffect(() => {
        if (!lastMessage) return;
        const response = JSON.parse(lastMessage.data);
        if (!response || !response.result || !response.result[0]) return;
        const userInfo = response.result[0];
        console.log(`[LOG]: Receive initUser data:`, userInfo);
        setUserId(userInfo.user_id);
    }, [lastMessage, setUserId]);

    return children;
};

export default StoreInit;
