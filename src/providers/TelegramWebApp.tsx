'use client';

import React, {FC, useEffect, PropsWithChildren} from 'react';
import WebApp from "@twa-dev/sdk";

import {useGameStore} from "@/components/game";
import useWebSocketStore from "@/stores/useWebSocketStore";

const TelegramWebApp: FC<PropsWithChildren> = ({children}) => {
    const INIT_USER_MESSAGE_ID = 1000

    const {userId, setUserId, deviceId, setDeviceId} = useGameStore((state) => ({
        userId: state.userId,
        setUserId: state.setUserId,
        deviceId: state.deviceId,
        setDeviceId: state.setDeviceId,
    }));

    const {readyState, lastMessage, sendMessage} = useWebSocketStore((state) => ({
        readyState: state.readyState,
        lastMessage: state.lastMessage,
        sendMessage: state.sendMessage,
    }))

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
        }
    }, []);

    // Initial get or create device id
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const telegramInitData = WebApp.initData;
            const savedDeviceId = localStorage['deviceId'];
            const deviceId = telegramInitData
                ? WebApp.initData
                : savedDeviceId
                    ? savedDeviceId
                    : self.crypto.randomUUID();
            console.log(`[LOG]: Set device id ${deviceId}!`);

            setDeviceId(deviceId);
        }
    }, []);

    // If deviceId updated, save to local storage and initUser
    useEffect(() => {
        if (readyState != 1 && typeof window !== 'undefined') return

        localStorage['deviceId'] = deviceId;

        if (!deviceId) return;

        const message = {
            jsonrpc: '2.0',
            id: INIT_USER_MESSAGE_ID,
            method: 'initUser',
            params: {
                userId: deviceId,
            },
        };

        console.log(`[LOG]: Call initUser method, with data:`, message);
        sendMessage(JSON.stringify(message));
    }, [deviceId, sendMessage, readyState]);

    // Receive initUser response
    useEffect(() => {
        if (!lastMessage) return;
        console.log(JSON.parse(lastMessage));

        const response = JSON.parse(lastMessage);
        console.log('res ', response);
        if (response.id != INIT_USER_MESSAGE_ID) return
        console.log(`[LOG]: Receive initUser data:`, response);

        if (!response || !response.result || !response.result[0]) return;
        const userInfo = response.result[0];
        console.log(`[LOG]: Parse initUser data:`, userInfo);
        setUserId(userInfo.user_id);
    }, [lastMessage]);

    return <>
        {children}
    </>
};

export default TelegramWebApp;
