import React, {FC} from 'react'

import DiamondPointsIcon from '/public/images/diamond-points.svg';
import CrossIcon from '/public/images/cross-mini.svg';

import styles from './TotalPoints.module.css';

const TotalPoints: FC = () => {
    return <div className={styles.root}>
        <DiamondPointsIcon className={styles.icon}/>

        <span className={styles.value}>10 845</span>

        <span className={styles.multiplier}><CrossIcon/> 1.3</span>
    </div>
};

export default TotalPoints;
