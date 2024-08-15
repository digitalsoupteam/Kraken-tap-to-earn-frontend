import React, {FC} from 'react';

import styles from './Points.module.css';
import PointsIcon from "/public/images/diamond-points.svg";

interface PointsProps {
    points: number;
}

const Points: FC<PointsProps> = ({points}) => {
    return <span className={styles.root}>{new Intl.NumberFormat('ru-RU').format(points)} <PointsIcon
        className={styles.icon}/></span>
};

export default Points;
