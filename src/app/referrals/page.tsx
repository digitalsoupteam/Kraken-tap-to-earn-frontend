import React, {FC} from 'react';

import {PageHeading} from "@/components/common";
import {Wrapper} from '@/components/layout';
import {Banner, ReferralsBar, ReferralsList} from '@/components/referrals';

import styles from './Referrals.module.css';

const Referrals: FC = () => {
    return (
        <div className={styles.root}>
            <PageHeading image="/images/referrals-image.png" title="invite your" titleAccent="friends"/>

            <Wrapper>
                <Banner/>

                <ReferralsList/>

                <ReferralsBar/>
            </Wrapper>
        </div>
    );
}

export default Referrals;
