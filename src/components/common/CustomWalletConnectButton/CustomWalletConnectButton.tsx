import React, {FC, useState, useCallback} from 'react';
import clsx from "clsx";
import {Wallet} from "@wallet-standard/base";
import {WalletName} from "@solana/wallet-adapter-base";
import {useWallet} from "@solana/wallet-adapter-react";
import {useWalletMultiButton} from "@solana/wallet-adapter-base-ui";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";

import LoginIcon from '/public/images/login.svg';

import styles from './CustomWalletConnectButton.module.css';

interface CustomWalletConnectButtonProps {
    className?: string;
    size: 'big' | 'medium';
}

const CustomWalletConnectButton: FC<CustomWalletConnectButtonProps> = ({className, size}) => {
    const [walletModalConfig, setWalletModalConfig] = useState<Readonly<{
        onSelectWallet(walletName: WalletName): void;
        wallets: Wallet[];
    }> | null>(null);

    const {buttonState, onConnect, onDisconnect, onSelectWallet} = useWalletMultiButton({
    //@ts-ignore
        onSelectWallet: setWalletModalConfig,
    });

    const {publicKey} = useWallet();
    const formattedPublicKey = publicKey
        ? `${publicKey.toBase58().slice(0, 4)}..${publicKey.toBase58().slice(-4)}`
        : '';

    let label;

    switch (buttonState) {
        case 'connected':
            label = formattedPublicKey;
            break;
        case 'connecting':
            label = 'Connecting';
            break;
        case 'disconnecting':
            label = 'Disconnecting';
            break;
        case 'has-wallet':
            label = 'Connect';
            break;
        case 'no-wallet':
            label = 'connect wallet';
            break;
    }

    const handleClick = useCallback(() => {
        switch (buttonState) {
            case 'connected':
                return onDisconnect;
            case 'connecting':
            case 'disconnecting':
                break;
            case 'has-wallet':
                return onConnect;
            case 'no-wallet':
                return onSelectWallet;
                break;
        }
    }, [buttonState, onDisconnect, onConnect, onSelectWallet]);

    return (
        <div className={clsx(styles.root, styles[size], className, buttonState !== 'no-wallet' && styles.dark)}>
            <WalletMultiButton>
                {buttonState === 'no-wallet' && <LoginIcon/>} {label}
            </WalletMultiButton>
        </div>
    );
};

export default CustomWalletConnectButton;
