'use client';

import React, {FC} from 'react';

import {BottomBar} from "@/components/common";
import {ProgressTracker, useGameStore} from "@/components/game";
import {Button} from '@/components/ui';
import WalletConnectButton from "@/components/common/WalletConnectButton/WalletConnectButton";
import useModalStore from "@/stores/useModalSotre";
import SettingsIcon from '/public/images/settings.svg';

import styles from './GameBar.module.css';

const GameBar: FC = () => {
    const {wallet} = useGameStore((state) => ({wallet: state.wallet}));
    const {openSettings} = useModalStore((state) => ({openSettings: state.openSettings}));

    return <BottomBar>
        <ProgressTracker/>

        {!wallet && <WalletConnectButton className={styles.walletConnect} size={'medium'}/>}

        <Button className={styles.settings} onClick={openSettings}>
            <SettingsIcon/>
        </Button>
    </BottomBar>
};

export default GameBar;
