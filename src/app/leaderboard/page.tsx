import React, {FC} from 'react';

import {PageHeading} from "@/components/common";
import {LeaderboardList, LeaderboardBar} from "@/components/leaderboard";

import styles from './Leaderboard.module.css';

const Leaderboards: FC = () => {
    return <div className={styles.root}>
        <PageHeading image="/images/leaderboards-image.png" title="The best" titleAccent="krakens"/>

        <LeaderboardList/>

        <LeaderboardBar/>
    </div>
}

export default Leaderboards;
