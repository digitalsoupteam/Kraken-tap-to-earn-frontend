'use client';

import React, {FC, useEffect, PropsWithChildren} from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import useWebSocketStore from "@/stores/useWebSocketStore";
import {useGameStore} from "@/components/game";
import WebApp from "@twa-dev/sdk";

const WebSocket: FC<PropsWithChildren> = ({children}) => {
    const {
        setSendMessage,
        setMessages,
        getUser,
        setReadyState,
        connectionStatus,
        setLastMessage,
        jwt,
        setJwt,
    } = useWebSocketStore((state) => ({
        setSendMessage: state.setSendMessage,
        setMessages: state.setMessages,
        getUser: state.getUser,
        setReadyState: state.setReadyState,
        connectionStatus: state.connectionStatus,
        setLastMessage: state.setLastMessage,
        jwt: state.jwt,
        setJwt: state.setJwt,
    }));

    const {
        userId,
        setUserId,
        setTotalPoints,
        setSessionLeft,
        setCalmUntil,
        setSessionUntil,
        setUserName,
        telegramInitData,
        setMultiplier,
    } = useGameStore((state) => ({
        userId: state.userId,
        setUserId: state.setUserId,
        setTotalPoints: state.setTotalPoints,
        setSessionLeft: state.setSessionLeft,
        setCalmUntil: state.setCalmUntil,
        setSessionUntil: state.setSessionUntil,
        setUserName: state.setUserName,
        telegramInitData: state.telegramInitData,
        setMultiplier: state.setMultiplier,
    }));

    // const WS_URL = process.env.NEXT_PUBLIC_WS_URL || `https://game.releasethekraken.io/backend/ws`;
    // const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://194.67.88.140:3000/ws';
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://game.releasethekraken.io/backend/ws';

    const getJWT = async () => {
        const url = telegramInitData ? 'https://game.releasethekraken.io/backend/api/telegram_session' : 'https://game.releasethekraken.io/backend/api/anonymous_session';
        const referrerId = telegramInitData && new URLSearchParams(telegramInitData).get('start_param');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...(referrerId && {referrer_id: referrerId}),
                    ...(telegramInitData && {initData: telegramInitData}),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const jwtToken = data.jwt;

            jwtToken && setJwt(jwtToken);

            return jwtToken;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const logData = {
        platform: WebApp.platform,
        initData: WebApp.initData,
        storedInitData: telegramInitData,
    };
    console.log('[LOG]: log data: ', logData);

    const {sendMessage, lastMessage, readyState} = useWebSocket(WS_URL, {
        onError: (error) => {
            console.error('WebSocket error: ', error);
        },
        onMessage: (message) => {
            // @ts-ignore
            setMessages((prevMessages) => [...prevMessages, message.data]);
        },
        shouldReconnect: (closeEvent) => true,
        queryParams: {
            jwt: jwt,
        }
    });

    useEffect(() => {
        if (typeof telegramInitData !== null) {
            !jwt && getJWT();
        }
    }, [telegramInitData, jwt]);

    useEffect(() => {
        setSendMessage(sendMessage);
    }, [sendMessage]);

    useEffect(() => {
        setReadyState(readyState);

        if (readyState === ReadyState.OPEN) {
            getUser();
        }
    }, [readyState]);

    useEffect(() => {
        console.log('[LOG]: WS status: ', connectionStatus);
    }, [connectionStatus]);

    useEffect(() => {
        if (!lastMessage) return;

        setLastMessage(lastMessage?.data);

        if (userId) return;

        const response = JSON.parse(lastMessage.data);

        if (response.id !== 1000) return;
        console.log(`[LOG]: Receive getUser data`, response);

        if (!response.result[0]) {
            getJWT();
            console.log(`[LOG]: JWT was updated`);
            return;
        }

        setUserId(response.result[0].user_id);
        setTotalPoints(response.result[0].points.toFixed(1));
        setSessionLeft(response.result[0].session_left);
        setCalmUntil(response.result[0].calm_until);
        setSessionUntil(response.result[0].session_until);
        setUserName(response.result[0].nickname);
        setMultiplier(response.result[0].days_in_row);
    }, [lastMessage]);

    return <>{children}</>;
};

export default WebSocket;
