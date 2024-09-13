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
        setWallet,
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
        setWallet: state.setWallet,
    }));

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
        if (typeof telegramInitData === null) return;

        if (jwt || telegramInitData) return;

        getJWT();
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

        const userInfo = response.result[0];
        setUserId(userInfo.user_id);
        setTotalPoints(userInfo.points.toFixed(1));
        setSessionLeft(userInfo.session_left);
        setCalmUntil(userInfo.calm_until);
        setSessionUntil(userInfo.session_until);
        setUserName(userInfo.nickname);
        setMultiplier(userInfo.days_in_row);
        setWallet(userInfo.wallet);
    }, [lastMessage]);

    return <>{children}</>;
};

export default WebSocket;
