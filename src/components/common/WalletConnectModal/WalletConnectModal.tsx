'use client';

import React, {FC, useState, useEffect} from 'react';

import useModalStore from "@/stores/useModalSotre";
import {Button, Input} from '@/components/ui';
import useWebSocketStore from "@/stores/useWebSocketStore";
import {useGameStore} from "@/components/game";

import styles from './WalletConnectModal.module.css';
import {Modal} from "@/components/common";

const WalletConnectModal: FC = () => {
    const [walletValue, setWalletValue] = useState('');

    const {
        isWalletConnectOpened,
        closeWalletConnect,
    } = useModalStore((state) => ({
        isWalletConnectOpened: state.isWalletConnectOpened,
        closeWalletConnect: state.closeWalletConnect,
    }));

    const {wallet, setWallet} = useGameStore((state) => ({wallet: state.wallet, setWallet: state.setWallet}));

    const {updateProfile, lastMessage, setLastMessage} = useWebSocketStore((state) => ({
        updateProfile: state.updateProfile,
        lastMessage: state.lastMessage,
        setLastMessage: state.setLastMessage,
    }))

    const handlerWalletInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setWalletValue(evt.target.value);
    };

    const handlerSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        const regex = /^[1-9A-HJ-NP-Za-km-z]{44}$/;

        if (!regex.test(walletValue)) return;

        updateProfile({wallet: walletValue});
    };

    useEffect(() => {
        if (!lastMessage) return;

        const response = JSON.parse(lastMessage);
        if (response.id !== 5001) return;

        if (response.error) throw new Error(response.error);

        if (!response.result.wallet) return;

        setWallet(response.result.wallet);
        console.log('[LOG]: Wallet was updated successfully ', response.result.wallet);
    }, [lastMessage]);

    return <Modal isOpen={isWalletConnectOpened} closeModal={closeWalletConnect}>
        {wallet ? <>
            <div className={styles.title}>Your wallet connected successfully</div>

            <Button className={styles.button} isLight={true} onClick={closeWalletConnect}>Close</Button>
        </> : <>
            <div className={styles.title}>Connect Wallet</div>

            <div className={styles.text}>Enter your Solana wallet address</div>

            <form onSubmit={handlerSubmit}>
                <Input className={styles.input} value={walletValue} onChange={handlerWalletInput}/>

                <Button className={styles.button} isLight={true}>Submit</Button>
            </form>
        </>}
    </Modal>
};

export default WalletConnectModal;
