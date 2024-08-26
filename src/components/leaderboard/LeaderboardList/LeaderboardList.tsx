'use client'; // This is a client component 👈🏽
import React, {FC, useEffect, useState} from 'react';

import {Wrapper} from '@/components/layout';
import {UserItem} from '@/components/common';

import styles from './LeaderboardList.module.css';
import useWebSocket from 'react-use-websocket';
import {useAppStore} from '@/providers/AppStoreProvider';

const LeaderboardList: FC = () => {
    const {userId} = useAppStore(state => state);

    const {sendMessage, lastMessage, readyState} = useWebSocket(
        process.env.NEXT_PUBLIC_WS_URL ?? 'ws://172.86.75.111:3000/ws',
        {share: true}
    );

    const [users, setUsers] = useState<
        Array<{
            id: string;
            name: string;
            points: number;
            image?: string;
        }>
    >([]);

    useEffect(() => {
        const message = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTopUsers',
            params: {
                limit: 10,
            },
        };
        console.log(`[LOG]: Call getTopUsers method, with data`, message);
        sendMessage(JSON.stringify(message));
    }, [sendMessage]);

    useEffect(() => {
        if (!lastMessage) return;
        const response = JSON.parse(lastMessage.data);
        console.log(`[LOG]: Receive getTopUsers data`, response);
        if (!response || !response.result || !response.result[0]) return; 
        const users = response.result;
        // collision with user compoennt
        console.log(`users[0].user_id ${users[0].user_id}`)
        console.log(`user_id ${userId}`)
        if(users.length == 1 && users[0].user_id == userId) return
    
        
        console.log(`[LOG]: Parse getTopUsers data`, users);
        setUsers(
            users.map((user: any) => ({
                id: user.user_id,
                name: user.nickname ? user.nickname : 'Unknow nickname',
                points: user.taps,
                image:
                    user.user_id == userId
                        ? '/images/user-image.png'
                        : undefined,
            }))
        );
    }, [lastMessage, userId]);

    //   const mockUsers = [
    //     {
    //       id: "user1",
    //       name: "Jonny Smith",
    //       points: 200000000,
    //       image: "/images/user-image.png",
    //     },
    //     {
    //       id: "user2",
    //       name: "Jonny Smith",
    //       points: 100000000,
    //     },
    //     {
    //       id: "user3",
    //       name: "Jonny Smith",
    //       points: 50000000,
    //     },
    //     {
    //       id: "user4",
    //       name: "Jonny Smith",
    //       points: 40000000,
    //     },
    //     {
    //       id: "user5",
    //       name: "Jonny Smith",
    //       points: 30000000,
    //     },
    //     {
    //       id: "user6",
    //       name: "Jonny Smith",
    //       points: 20000000,
    //     },
    //     {
    //       id: "user7",
    //       name: "Jonny Smith",
    //       points: 10000000,
    //     },
    //     {
    //       id: "user8",
    //       name: "Jonny Smith",
    //       points: 5000000,
    //     },
    //     {
    //       id: "user9",
    //       name: "Jonny Smith",
    //       points: 4000000,
    //     },
    //     {
    //       id: "user10",
    //       name: "Jonny Smith",
    //       points: 300000,
    //     },
    //     {
    //       id: "user11",
    //       name: "Jonny Smith",
    //       points: 2500000,
    //     },
    //   ];

    return <section>
        <Wrapper>
            <div className={styles.list}>
                {users &&
                    users.length &&
                    users.map((user, index) => (
                        <UserItem
                            placement={index + 1}
                            key={user.id}
                            image={user.image}
                            name={user.name}
                            points={user.points}
                        />
                    ))}
            </div>
        </Wrapper>
    </section>
};

export default LeaderboardList;
