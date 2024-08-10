import  React, {FC} from 'react';

import {BottomBar, CopyButton} from "@/components/common";
import {InviteButton} from "@/components/referrals";

import styles from './ReferralsBar.module.css';

const ReferralsBar: FC = () => {
    return <BottomBar>
        <div className={styles.container}>
            <InviteButton/>

            <CopyButton copyContent={'referral link'} />
        </div>
    </BottomBar>
};

export default ReferralsBar;
