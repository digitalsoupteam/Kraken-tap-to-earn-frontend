'use client';

import React, {FC, useEffect, useState} from 'react';

import {Points, UserImage} from "@/components/common";
import {useGameStore} from "@/components/game";

import styles from './UserProfile.module.css';

const UserProfile: FC = () => {
    const {
        userName,
        totalPoints,
        userPhoto,
        leaderboardPosition,
    } = useGameStore((state) => ({
        userName: state.userName,
        totalPoints: state.totalPoints,
        userPhoto: state.userPhoto,
        leaderboardPosition: state.leaderboardPosition,
    }));


    return <div className={styles.root}>
        <div>{leaderboardPosition}</div>
        <UserImage image={userPhoto} letter={userName.slice(0, 1)}/>

        <div className={styles.info}>
            <span className={styles.name}>
                {userName}
            </span>
            {/*<span className={styles.position}>*/}
            {/*    5% of the best*/}
            {/*</span>*/}
        </div>

        <Points points={totalPoints}/>
    </div>
};

export default UserProfile;
