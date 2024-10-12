'use client';

import React, {FC, useEffect, useState, PropsWithChildren} from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import useWebSocketStore from "@/stores/useWebSocketStore";
import {useGameStore} from "@/components/game";
import WebApp from "@twa-dev/sdk";

import {getRandomValue} from "@/utils";

const WebSocket: FC<PropsWithChildren> = ({children}) => {
    const {
        setSendMessage,
        setMessages,
        getUser,
        setReadyState,
        setLastMessage,
        jwt,
        connectionDelay,
        setConnectionDelay,
        getJwt,
    } = useWebSocketStore((state) => ({
        setSendMessage: state.setSendMessage,
        setMessages: state.setMessages,
        getUser: state.getUser,
        setReadyState: state.setReadyState,
        connectionStatus: state.connectionStatus,
        setLastMessage: state.setLastMessage,
        jwt: state.jwt,
        connectionDelay: state.connectionDelay,
        setConnectionDelay: state.setConnectionDelay,
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

    const [shouldConnect, setShouldConnect] = useState(false);

    if (!connectionDelay) setConnectionDelay(getRandomValue(1000, 3000));

    const params = new URLSearchParams(typeof window !== 'undefined' && WebApp.initData || '');
    const userData = params.get('user');
    const tgUserId =  JSON.parse(decodeURIComponent(userData || "{}"))?.id;

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://game.releasethekraken.io/backend/ws';

    const { sendMessage, lastMessage, readyState } = useWebSocket(
        shouldConnect && jwt ? WS_URL : null,
        {
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
        }
    );

    useEffect(() => {
        if (telegramInitData === null) return;

        const localTgId = typeof window !== 'undefined' && localStorage.getItem('tgUserId');


        if (!jwt || String(localTgId) !== String(tgUserId)) {
            const timer = setTimeout(() => {
                getJwt(typeof window !== 'undefined' && WebApp.initData || '');
                setShouldConnect(true);
            }, connectionDelay);

            return () => clearTimeout(timer);
        }

        if (jwt) {
            const timer = setTimeout(() => {
                setShouldConnect(true);
            }, connectionDelay);

            return () => clearTimeout(timer);
        }
    }, [telegramInitData, jwt, connectionDelay]);

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

        if (!response.result) {
            getJwt(typeof window !== 'undefined' && WebApp.initData || '');
            console.log(`[LOG]: JWT was updated`);
            return;
        }

        typeof window !== 'undefined' && localStorage.setItem('tgUserId', tgUserId);

        const userInfo = response.result;
        const totalPoints = userInfo.points.toFixed(1);
        const level = levelsGates.findLastIndex((item) => totalPoints >= item);

        setUserId(userInfo.user_id);
        setTotalPoints(totalPoints);
        setLevel(level);
        setSessionLeft(userInfo.sessionLeft);
        setCalmUntil(userInfo.calmUntil);
        setSessionUntil(userInfo.sessionUntil);
        setSessionStart(userInfo.sessionStart);
        setUserName(userInfo.nickname);
        setMultiplier(userInfo.daysInRow);
        setWallet(userInfo.wallet);
        !userInfo.sessionUntil && setTimeOffset(Math.floor(Date.now() / 1000) - userInfo.sessionStart);
        setLeaderboardPosition(userInfo.position);
    }, [lastMessage]);

    return <>{children}</>;
};

export default WebSocket;
