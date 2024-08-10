import React, {FC} from 'react';

import EnergyIcon from '/public/images/energy.svg';

import styles from './EnergyTracker.module.css';

const EnergyTracker: FC = () => {
    return <div className={styles.root}>
        <div className={styles.inner}>
            <div className={styles.time}>
                <EnergyIcon />
                10 / 10 min
            </div>
            <div className={styles.tracker}>
                <div className={styles.bar}>
                    <div className={styles.progress} style={{width: '100%'}}/>
                </div>
            </div>
        </div>
    </div>
};

export default EnergyTracker;
