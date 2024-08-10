import React, {FC} from 'react';
import Image from "next/image";

import {Wrapper} from "@/components/layout";
import {PageHeading} from "@/components/common";
import {TotalPoints, TapButton, EnergyTracker} from "@/components/game/";

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
                <PageHeading title={'tap and go'} titleAccent={'into space'} size={'big'}/>

                <TotalPoints/>

                <TapButton/>

                <EnergyTracker/>
            </div>
        </Wrapper>
    </section>
};

export default GameContainer;
