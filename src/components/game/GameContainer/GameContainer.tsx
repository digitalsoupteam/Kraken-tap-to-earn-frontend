import React, {FC, useEffect} from 'react';
import Image from "next/image";

import {Wrapper} from "@/components/layout";
import {TotalPoints, TapButton, EnergyTracker, GameBar} from "@/components/game/";
import useGameStore from "../store/useGameStore";

import styles from './GameContainer.module.css';

const backgrounds = [
    '/images/background-bottom.png',
    '/images/background-seaside.png',
    '/images/background-troposphere.png',
    '/images/background-outer-space.png',
];

const GameContainer: FC = () => {
    const {level} = useGameStore((state) => ({
        level: state.level
    }));

    return <section className={styles.root}>
        <div className={styles.background}>
            <Image src={backgrounds[level]} width="300" height="100" alt=""/>
        </div>

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
