import React, {FC} from 'react';
import clsx from 'clsx';

import EnergyIcon from '/public/images/energy.svg';

import styles from './EnergyTracker.module.css';
import Image from "next/image";

const EnergyTracker: FC = () => {
    const isEnergyFull = true;

    return <div className={styles.root}>
        <div className={styles.inner}>
            <div className={styles.tentacles}>
                <div className={clsx(styles.tentaclesItem, styles.tentaclesleft, isEnergyFull && styles.tentaclesItemShow)}>
                    <Image src={'/images/tentacles-1.png'} width={'74'} height={'33'} alt={'kraken tentacles'} />
                </div>
                <div className={clsx(styles.tentaclesItem, styles.tentaclesRight, isEnergyFull && styles.tentaclesItemShow)}>
                    <Image src={'/images/tentacles-2.png'} width={'76'} height={'73'}  alt={'kraken tentacles'} />
                </div>
            </div>

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
