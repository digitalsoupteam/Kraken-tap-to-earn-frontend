import React, {FC} from 'react';
import clsx from 'clsx';

import {UserImage} from "@/components/common";
import styles from './ProgressTracker.module.css';

interface ProgressTrackerProps {
    className?: string;
}

const ProgressTracker: FC<ProgressTrackerProps> = ({className}) => {
    return <div className={clsx(styles.root, className)}>
        <UserImage/>

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
