'use client';

import React, {FC, useEffect, useState} from 'react';

import {Points, UserImage} from "@/components/common";
import {useGameStore} from "@/components/game";
import useWebSocketStore from "@/stores/useWebSocketStore";
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

        <Points points={200000000}/>
    </div>
};

export default UserProfile;
