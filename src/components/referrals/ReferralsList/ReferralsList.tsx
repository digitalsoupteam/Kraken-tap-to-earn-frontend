import React, {FC} from 'react';

import styles from './ReferralsList.module.css';

const ReferralsList: FC = () => {
    return <div className={styles.root}>
        <div className={styles.title}>
            Your referrals
        </div>

        {/*<div className={styles.list}>*/}
        {/*</div>*/}

        <div className={styles.noReferrals}>You haven&apos;t invited anyone yet</div>
    </div>
};

export default ReferralsList;
