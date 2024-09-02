'use client';

import React, {FC} from 'react';
import clsx from "clsx";

import LoginIcon from '/public/images/login.svg';
import {Button} from "@/components/ui";

import styles from './WalletConnectButton.module.css';
import useModalStore from "@/stores/useModalSotre";

interface CustomWalletConnectButtonProps {
    className?: string;
    size: 'big' | 'medium';
}

const WalletConnectButton: FC<CustomWalletConnectButtonProps> = ({className, size}) => {
    const {
        openWalletConnect,
    } = useModalStore((state) => ({
        openWalletConnect: state.openWalletConnect,
    }));

    return (
        <Button className={clsx(styles.root, className, styles[size])} onClick={openWalletConnect} isLight={true}>
            Connect wallet
            <LoginIcon/>
        </Button>
    );
};

export default WalletConnectButton;
