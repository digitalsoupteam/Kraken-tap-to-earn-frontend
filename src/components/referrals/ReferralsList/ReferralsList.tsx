'use client';

import React, {FC, useEffect} from 'react';

import {UserItem} from "@/components/common";
import useWebSocketStore from "@/stores/useWebSocketStore";
import {useGameStore} from "@/components/game";

import styles from './ReferralsList.module.css';

const ReferralsList: FC = () => {
    const {
        getTopReferrals,
        lastMessage,
    } = useWebSocketStore((state) => ({
        getTopReferrals: state.getTopReferrals,
        lastMessage: state.lastMessage,
    }));

    const {
        referralsList,
        setReferralsList,
    } = useGameStore((state) => ({
        referralsList: state.referralsList,
        setReferralsList: state.setReferralsList,
    }));

    useEffect(() => {
        getTopReferrals();
    }, []);

    useEffect(() => {
        if (!lastMessage) return;

        const response = JSON.parse(lastMessage);

        if (response.id !== 4000) return;
        console.log(`[LOG]: Receive top referrals data`, response.result);
        setReferralsList(response.result);
    }, [lastMessage]);

    return <div className={styles.root}>
        <div className={styles.title}>
            Your referrals
        </div>

        {
            referralsList ? <div className={styles.list}>
                {referralsList && referralsList.length && referralsList.map(referral => (
                    <UserItem name={referral.nickname} points={referral.points} key={referral.id}/>
                ))}
            </div> : <div className={styles.noReferrals}>You haven&apos;t invited anyone yet</div>
        }

    </div>
};

export default ReferralsList;
