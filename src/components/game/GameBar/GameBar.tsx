'use client';

import React, {FC} from 'react';

import {BottomBar} from "@/components/common";
import {ProgressTracker, useGameStore} from "@/components/game";
import WalletConnectButton from "@/components/common/WalletConnectButton/WalletConnectButton";


const GameBar: FC = () => {
    const {wallet} = useGameStore((state) => ({wallet: state.wallet}));

    return <BottomBar>
        <ProgressTracker/>

        {!wallet && <WalletConnectButton size={'medium'}/>}
    </BottomBar>
};

export default GameBar;
