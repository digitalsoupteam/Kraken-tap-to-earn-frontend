'use client';
import React, {FC} from 'react'

import DiamondPointsIcon from '/public/images/diamond-points.svg';
import CrossIcon from '/public/images/cross-mini.svg';
import {useGameStore} from "@/components/game";

import styles from './TotalPoints.module.css';

const TotalPoints: FC = () => {
    const totalPoints = useGameStore(state => state.totalPoints);
    const multiplier = useGameStore(state => state.multiplier);

    return <div className={styles.root}>
        <DiamondPointsIcon className={styles.icon}/>

        <span className={styles.value}>{totalPoints}</span>

        <span className={styles.multiplier}><CrossIcon/> {multiplier}</span>
    </div>
};

export default TotalPoints;
