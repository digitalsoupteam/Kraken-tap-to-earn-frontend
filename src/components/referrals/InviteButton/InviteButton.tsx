'use client';

import React, {FC} from 'react';

import {CopyButton} from '@/components/common'
import {useGameStore} from "@/components/game";

import styles from './InviteButton.module.css';

const InviteButton: FC = () => {
    const {
        userId: userId,
    } = useGameStore((state) => ({
        userId: state.userId,
    }));

    return <CopyButton className={styles.button}
                       copyContent={`https://t.me/kraken_tap_to_earn_bot/kraken_tap_to_earn?startapp=${userId}`}>
        Invite a friend
    </CopyButton>
};

export default InviteButton;
