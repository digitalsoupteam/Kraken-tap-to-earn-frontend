import React, {FC, useEffect} from 'react';
import Image from "next/image";

import {Wrapper} from "@/components/layout";
import {TotalPoints, TapButton, EnergyTracker, GameBar} from "@/components/game/";

import styles from './GameContainer.module.css';

const GameContainer: FC = () => {
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
