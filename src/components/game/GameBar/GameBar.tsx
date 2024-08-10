'use client';

import React, {FC} from 'react';

import {BottomBar} from "@/components/common";
import {ProgressTracker} from "@/components/game";
import CustomWalletConnectButton from "@/components/common/CustomWalletConnectButton/CustomWalletConnectButton";


const GameBar: FC = () => {
    return <BottomBar>
        <ProgressTracker/>

        <CustomWalletConnectButton />
    </BottomBar>
};

export default GameBar;
