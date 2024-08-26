'use client'; 
import React, {FC, useEffect, useState} from 'react';

import {Points, UserImage} from '@/components/common';
import DiamondPointsIcon from '/public/images/diamond-points.svg';

import styles from './UserProfile.module.css';
import useWebSocket from 'react-use-websocket';
import {useAppStore} from '@/providers/AppStoreProvider';

const UserProfile: FC = () => {
    const {userId} = useAppStore(state => state);

    const {sendMessage, lastMessage, readyState} = useWebSocket(
        'ws://127.0.0.1:3000/ws',
        {share: true}
    );

    const [user, setUser] = useState<
        | {
              id: string;
              name: string;
              points: number;
              image?: string;
          }
        | undefined
    >();

    useEffect(() => {
        if (!userId) return;
        const message = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getUser',
            params: {
                userId,
            },
        };
        console.log(`[LOG]: Call getUser method, with data`, message);
        sendMessage(JSON.stringify(message));
    }, [userId, sendMessage]);

    useEffect(() => {
        if (!lastMessage) return;
        const response = JSON.parse(lastMessage.data);
        console.log(`[LOG]: Receive getUser data`, response);
        if (!response || !response.result || !response.result[0]) return;
        const userInfo = response.result[0];
        console.log(`[LOG]: Parce getUser method data`, userInfo);
        const user = {
            id: userInfo.user_id,
            name: userInfo.nickname ? userInfo.nickname : 'Unknow nickname',
            points: userInfo.taps,
            image: '/images/user-image.png',
        };
        setUser(user);
    }, [lastMessage, userId]);

    return <div className={styles.root}>
        <UserImage image={'/images/user-image.png'} />

        <div className={styles.info}>
            <span className={styles.name}>{user?.name}</span>
            <span className={styles.position}>5% of the best</span>
        </div>

        <Points points={user?.points ?? 0} />
    </div>
};

export default UserProfile;
