'use client';

import React, {FC, useEffect} from 'react';

import {Wrapper} from "@/components/layout";
import {UserItem} from "@/components/common";
import useWebSocketStore from "@/stores/useWebSocketStore";
import {useGameStore} from "@/components/game";

import styles from './LeaderboardList.module.css';

const LeaderboardList: FC = () => {
    const mockUsers = [
        {
            id: 'user1',
            name: 'Jonny Smith',
            points: 200000000,
            image: '/images/user-image.png',
        },
        {
            id: 'user2',
            name: 'Jonny Smith',
            points: 100000000,
        },
        {
            id: 'user3',
            name: 'Jonny Smith',
            points: 50000000,
        },
        {
            id: 'user4',
            name: 'Jonny Smith',
            points: 40000000,
        },
        {
            id: 'user5',
            name: 'Jonny Smith',
            points: 30000000,
        },
        {
            id: 'user6',
            name: 'Jonny Smith',
            points: 20000000,
        },
        {
            id: 'user7',
            name: 'Jonny Smith',
            points: 10000000,
        },
        {
            id: 'user8',
            name: 'Jonny Smith',
            points: 5000000,
        },
        {
            id: 'user9',
            name: 'Jonny Smith',
            points: 4000000,
        },
        {
            id: 'user10',
            name: 'Jonny Smith',
            points: 300000,
        },
        {
            id: 'user11',
            name: 'Jonny Smith',
            points: 2500000,
        },
    ];

    const {
        getTopUsers,
        lastMessage,
    } = useWebSocketStore((state) => ({
        getTopUsers: state.getTopUsers,
        lastMessage: state.lastMessage,
    }));

    const {
        leadersList,
        setLeadersList,
    } = useGameStore((state) => ({
        leadersList: state.leadersList,
        setLeadersList: state.setLeadersList,
    }));

    useEffect(() => {
        getTopUsers();
    }, []);

    useEffect(() => {
        if (!lastMessage) return;

        if (leadersList.length) return;

        const response = JSON.parse(lastMessage);

        if (response.id !== 3000) return;
        console.log(`[LOG]: Receive top users data`, response.result);
        setLeadersList(response.result);
    }, [lastMessage]);

    return <section>
        <Wrapper>
            <div className={styles.list}>
                {leadersList && leadersList.length > 0 && leadersList.map((user, index) => (
                    <UserItem placement={index + 1} key={user.id} name={user.nickname} points={user.taps}/>
                ))}
            </div>
        </Wrapper>
    </section>
};

export default LeaderboardList;
