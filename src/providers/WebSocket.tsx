'use client';

import React, {FC, useState, useEffect, PropsWithChildren} from 'react';
import { useSearchParams } from 'next/navigation'
import useWebSocket from 'react-use-websocket';
import useWebSocketStore from "@/stores/useWebSocketStore";
import {useGameStore} from "@/components/game";

const WebSocket: FC<PropsWithChildren> = ({children}) => {
    const searchParams = useSearchParams();

    const {
        setSendMessage,
        setMessages,
        setReadyState,
        connectionStatus,
        setLastMessage,
        jwt,
        setJwt,
    } = useWebSocketStore((state) => ({
        setSendMessage: state.setSendMessage,
        setMessages: state.setMessages,
        setReadyState: state.setReadyState,
        connectionStatus: state.connectionStatus,
        setLastMessage: state.setLastMessage,
        jwt: state.jwt,
        setJwt: state.setJwt,
    }));

    const {
        telegramInitData,
    } = useGameStore((state) => ({
        telegramInitData: state.telegramInitData,
    }));

    // const WS_URL = process.env.NEXT_PUBLIC_WS_URL || `https://game.releasethekraken.io/backend/ws`;
    // const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://194.67.88.140:3000/ws';
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://game.releasethekraken.io/backend/ws';

    const getJWT = async () => {
        const url = telegramInitData ? 'https://game.releasethekraken.io/backend/api/telegram_session' : 'https://game.releasethekraken.io/backend/api/anonymous_session';
        const referrerId = searchParams.get('ref');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...(referrerId && { referrerId }),
                    ...(telegramInitData && { telegramInitData }),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const jwtToken = data.jwt;

            jwtToken && setJwt(jwtToken)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    !jwt && getJWT();

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
        setSendMessage(sendMessage);
    }, [sendMessage]);

    useEffect(() => {
        setReadyState(readyState);
    }, [readyState]);

    useEffect(() => {
        console.log('[LOG]: WS status: ', connectionStatus);
    }, [connectionStatus]);

    useEffect(() => {
        setLastMessage(lastMessage?.data);
    }, [lastMessage]);

    return <>{children}</>;
};

export default WebSocket;
