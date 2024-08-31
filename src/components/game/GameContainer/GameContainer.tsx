import React, {FC, useEffect} from 'react';
import Image from "next/image";

import {Wrapper} from "@/components/layout";
import {TotalPoints, TapButton, EnergyTracker, GameBar, useGameStore} from "@/components/game/";
import useWebSocketStore from "@/stores/useWebSocketStore";

import styles from './GameContainer.module.css';

const GameContainer: FC = () => {
    const {
        lastMessage,
        getUser
    } = useWebSocketStore((state) => ({
        lastMessage: state.lastMessage,
        getUser: state.getUser,
    }));

    const {
        userId,
        setUserId,
        setTotalPoints,
        setSessionLeft,
        setCalmUntil,
        setSessionUntil,
    } = useGameStore((state) => ({
        userId: state.userId,
        setUserId: state.setUserId,
        setTotalPoints: state.setTotalPoints,
        setSessionLeft: state.setSessionLeft,
        setCalmUntil: state.setCalmUntil,
        setSessionUntil: state.setSessionUntil,
    }));

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (!lastMessage) return;

        if (userId) return;

        const response = JSON.parse(lastMessage);

        if (response.id !== 1000) return;
        console.log(`[LOG]: Receive getUser data`, response);

        setUserId(response.result[0].user_id);
        setTotalPoints(response.result[0].taps);
        setSessionLeft(response.result[0].session_left);
        setCalmUntil(response.result[0].calm_until);
        setSessionUntil(response.result[0].session_until);
    }, [lastMessage]);

    return <section className={styles.root}>
        <div className={styles.background}>
            <Image src="/images/background-bottom.png" width="300" height="100" alt=""/>
        </div>

        {/*<div className={styles.background}>*/}
        {/*    <Image src="/images/background-seaside.png" width="300" height="100" alt=""/>*/}
        {/*</div>*/}

        {/*<div className={styles.background}>*/}
        {/*    <Image src="/images/background-troposhere.png" width="300" height="100" alt=""/>*/}
        {/*</div>*/}

        {/*<div className={styles.background}>*/}
        {/*    <Image src="/images/background-outer-space.png" width="300" height="100" alt=""/>*/}
        {/*</div>*/}

        <Wrapper>
            <div className={styles.inner}>
                <TotalPoints/>

                <TapButton/>

                <EnergyTracker/>

                <GameBar/>
            </div>
        </Wrapper>
    </section>
};

export default GameContainer;
