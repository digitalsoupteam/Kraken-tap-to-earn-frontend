'use client';

import React, {FC, useEffect} from 'react';

import styles from './ReferralsList.module.css';
import {UserItem} from "@/components/common";
import useWebSocketStore from "@/stores/useWebSocketStore";
import {useGameStore} from "@/components/game";

const ReferralsList: FC = () => {
    const referrals = [
        {
            id: 'user1',
            name: 'J. Smith',
            points: 100000000
        },
        {
            id: 'user2',
            name: 'J. Smith',
            points: 100000000
        },
        {
            id: 'user3',
            name: 'J. Smith',
            points: 100000000
        },
        {
            id: 'user4',
            name: 'J. Smith',
            points: 100000000
        },
        {
            id: 'user5',
            name: 'J. Smith',
            points: 100000000
        },
    ];

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

        if (referralsList.length) return;

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
            referrals ? <div className={styles.list}>
                {referrals && referrals.length && referrals.map(referral => (
                    <UserItem name={referral.name} points={referral.points} key={referral.id}/>
                ))}
            </div> : <div className={styles.noReferrals}>You haven&apos;t invited anyone yet</div>
        }

    </div>
};

export default ReferralsList;
