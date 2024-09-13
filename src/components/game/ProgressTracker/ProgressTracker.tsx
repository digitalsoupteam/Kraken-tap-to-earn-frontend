import React, {FC} from 'react';
import clsx from 'clsx';

import {UserImage} from "@/components/common";
import styles from './ProgressTracker.module.css';
import {useGameStore} from "@/components/game";

interface ProgressTrackerProps {
    className?: string;
}

const levels = [
    'Bottom',
    'Seaside',
    'Troposphere',
    'Outer space',
];

const ProgressTracker: FC<ProgressTrackerProps> = ({className}) => {
    const {
        userPhoto,
        totalPoints,
        userName,
        level,
        levelsGates,
    } = useGameStore((state) => ({
        userPhoto: state.userPhoto,
        totalPoints: state.totalPoints,
        userName: state.userName,
        level: state.level,
        levelsGates: state.levelsGates,
    }));

    const nextLevelGate = levelsGates[level + 1] || levelsGates[levelsGates.length - 1];
    const progressPercent = totalPoints < nextLevelGate ? (totalPoints / nextLevelGate * 100) : 100;

    return <div className={clsx(styles.root, className)}>
        <UserImage image={userPhoto} letter={userName.slice(0, 1)}/>

        <div className={styles.levelContainer}>
            <div className={styles.level}>{levels[level]}</div>
            <div className={styles.tracker}>
                <div className={styles.bar}>
                    <div className={styles.progress} style={{width: `${progressPercent}%`}}/>
                </div>
            </div>
        </div>
    </div>
};

export default ProgressTracker;
