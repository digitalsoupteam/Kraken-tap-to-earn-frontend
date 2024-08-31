import React, {FC} from 'react';
import clsx from 'clsx';

import {UserImage} from "@/components/common";
import styles from './ProgressTracker.module.css';
import {useGameStore} from "@/components/game";

interface ProgressTrackerProps {
    className?: string;
}

const ProgressTracker: FC<ProgressTrackerProps> = ({className}) => {
    const {
        userPhoto,
        userName
    } = useGameStore((state) => ({
        userPhoto: state.userPhoto,
        userName: state.userName,
    }));

    return <div className={clsx(styles.root, className)}>
        <UserImage image={userPhoto} letter={userName.slice(0, 1)}/>

        <div className={styles.levelContainer}>
            <div className={styles.level}>Seaside</div>
            <div className={styles.tracker}>
                <div className={styles.bar}>
                    <div className={styles.progress} style={{width: '50%'}}/>
                </div>
            </div>
        </div>
    </div>
};

export default ProgressTracker;
