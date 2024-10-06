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
        setLastMessage,
        jwt,
        getJwt,
    } = useWebSocketStore((state) => ({
        setSendMessage: state.setSendMessage,
        setMessages: state.setMessages,
        getUser: state.getUser,
        setReadyState: state.setReadyState,
        connectionStatus: state.connectionStatus,
        setLastMessage: state.setLastMessage,
        jwt: state.jwt,
        getJwt: state.getJwt,
    }));

    const {
        userId,
        setUserId,
        setTotalPoints,
        setSessionLeft,
        setCalmUntil,
        setSessionStart,
        setSessionUntil,
        setUserName,
        telegramInitData,
        setMultiplier,
        setWallet,
        levelsGates: levelsGates,
        setLevel,
        setTimeOffset,
        setLeaderboardPosition,
    } = useGameStore((state) => ({
        userId: state.userId,
        setUserId: state.setUserId,
        setTotalPoints: state.setTotalPoints,
        setSessionLeft: state.setSessionLeft,
        setCalmUntil: state.setCalmUntil,
        setSessionStart: state.setSessionStart,
        setSessionUntil: state.setSessionUntil,
        setUserName: state.setUserName,
        telegramInitData: state.telegramInitData,
        setMultiplier: state.setMultiplier,
        setWallet: state.setWallet,
        levelsGates: state.levelsGates,
        setLevel: state.setLevel,
        setTimeOffset: state.setTimeOffset,
        setLeaderboardPosition: state.setLeaderboardPosition,
    }));

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://game.releasethekraken.io/backend/ws';

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

        getJwt(typeof window !== 'undefined' && WebApp.initData || '');
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
        if (!lastMessage) return;

        setLastMessage(lastMessage?.data);

        if (userId) return;

        const response = JSON.parse(lastMessage.data);

        if (response.id !== 1000) return;
        console.log(`[LOG]: Receive getUser data`, response);

        if (!response.result[0]) {
            getJwt(typeof window !== 'undefined' && WebApp.initData || '');
            console.log(`[LOG]: JWT was updated`);
            return;
        }

        const userInfo = response.result[0];
        const totalPoints = userInfo.points.toFixed(1);
        const level = levelsGates.findLastIndex((item) => totalPoints >= item);

        setUserId(userInfo.user_id);
        setTotalPoints(totalPoints);
        setLevel(level);
        setSessionLeft(userInfo.session_left);
        setCalmUntil(userInfo.calm_until);
        setSessionUntil(userInfo.session_until);
        setSessionStart(userInfo.session_start);
        setUserName(userInfo.nickname);
        setMultiplier(userInfo.days_in_row);
        setWallet(userInfo.wallet);
        !userInfo.session_until && setTimeOffset(Math.floor(Date.now() / 1000) - userInfo.session_start);
        setLeaderboardPosition(userInfo.position);
    }, [lastMessage]);

    return <>{children}</>;
};

export default WebSocket;
