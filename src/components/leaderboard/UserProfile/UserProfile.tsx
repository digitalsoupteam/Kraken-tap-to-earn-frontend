import React, {FC} from 'react';

import {UserImage} from "@/components/common";
import DiamondPointsIcon from "/public/images/diamond-points.svg";

import styles from './UserProfile.module.css';

const UserProfile: FC = () => {
    return <div className={styles.root}>
        <UserImage image={'/images/user-image.png'}/>

        <div className={styles.info}>
            <span className={styles.name}>
                Jonny Smith
            </span>
            <span className={styles.position}>
                5% of the best
            </span>
        </div>

        <div className={styles.points}>
            <span className={styles.pointsValue}>200 000 000</span>
            <DiamondPointsIcon className={styles.pointsIcon}/>
        </div>
    </div>
};

export default UserProfile;
