import React, {FC} from 'react';
import clsx from 'clsx';

import {Points, UserImage} from "@/components/common";

import styles from './UserItem.module.css';

interface LeaderboardItemProps {
    placement?: number;
    image?: string;
    name: string;
    points: number;
}

const UserItem: FC<LeaderboardItemProps> = ({placement, image, name, points}) => {
    return <div
        className={clsx(styles.root, placement && styles.placementItem, placement && placement < 4 && styles.leader)}>
        {placement && <span className={styles.placement}>{placement}</span>}

        <UserImage image={image} letter={name.slice(0, 1)}/>

        <span className={styles.name}>{name}</span>

        <Points points={points}/>
    </div>
};

export default UserItem;
