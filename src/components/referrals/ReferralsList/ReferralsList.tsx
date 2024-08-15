import React, {FC} from 'react';

import styles from './ReferralsList.module.css';
import {UserItem} from "@/components/common";

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
