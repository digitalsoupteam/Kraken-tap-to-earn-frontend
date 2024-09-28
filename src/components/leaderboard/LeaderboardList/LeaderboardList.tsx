'use client';

import React, {FC, useEffect} from 'react';

import {Wrapper} from "@/components/layout";
import {UserItem} from "@/components/common";
import useWebSocketStore from "@/stores/useWebSocketStore";
import {useGameStore} from "@/components/game";

import styles from './LeaderboardList.module.css';

const LeaderboardList: FC = () => {
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
        console.log('req');
    }, [getTopUsers]);

    useEffect(() => {
        console.log('lm', lastMessage);
        if (!lastMessage) return;

        const response = JSON.parse(lastMessage);
        console.log('response', response);

        if (response.id !== 3000) return;
        console.log(`[LOG]: Receive top users data`, response.result);
        setLeadersList(response.result);
    }, [lastMessage]);

    return <section>
        <Wrapper>
            <div className={styles.list}>
                {leadersList && leadersList.length > 0 && leadersList.map((user, index) => (
                    <UserItem placement={index + 1} key={user.id} name={user.nickname} points={user.points}/>
                ))}
            </div>
        </Wrapper>
    </section>
};

export default LeaderboardList;
