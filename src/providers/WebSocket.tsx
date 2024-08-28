'use client';

import React, {FC, useState, useEffect, PropsWithChildren} from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import useWebSocketStore from "@/stores/useWebSocketStore";

const WebSocket: FC<PropsWithChildren> = ({children}) => {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://172.86.75.111:3000/ws';

    const {setSendMessage, setMessages, setReadyState, connectionStatus} = useWebSocketStore((state) => ({
        setSendMessage: state.setSendMessage,
        setMessages: state.setMessages,
        setReadyState: state.setReadyState,
        connectionStatus: state.connectionStatus,
    }));

    const {sendMessage, lastMessage, readyState} = useWebSocket(WS_URL, {
        onOpen: () => setReadyState(readyState),
        onError: (error) => {
            console.error('WebSocket error: ', error);
            setReadyState(readyState);
        },
        onClose: () => setReadyState(readyState),
        onMessage: (message) => {
            // @ts-ignore
            setMessages((prevMessages) => [...prevMessages, message.data]);
        },
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        setSendMessage(sendMessage);
        setReadyState(readyState);
    }, [sendMessage, readyState, setSendMessage, setReadyState]);

    console.log(connectionStatus);

    return <>{children}</>;
};

export default WebSocket;
