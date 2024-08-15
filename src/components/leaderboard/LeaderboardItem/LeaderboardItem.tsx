import React, {FC} from 'react';
import clsx from 'clsx';

import {UserImage} from "@/components/common";
import DiamondPointsIcon from "/public/images/diamond-points.svg";

import styles from './LeaderboardItem.module.css';

interface LeaderboardItemProps {
    placement: number;
    image?: string;
    name: string;
    points: number;
}

const LeaderboardItem: FC<LeaderboardItemProps> = ({placement, image, name, points}) => {
    return <div className={clsx(styles.root, placement < 4 && styles.leader)}>
        <span className={styles.placement}>{placement}</span>
        <UserImage image={image}/>
        <span className={styles.name}>{name}</span>
        <span className={styles.points}>{new Intl.NumberFormat('ru-RU').format(points)} <DiamondPointsIcon
            className={styles.diamondIcon}/></span>
    </div>
};

export default LeaderboardItem;
