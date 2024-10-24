'use client';

import React, {FC, useState, useEffect} from 'react';
import clsx from "clsx";

import {Modal, WalletConnectButton} from "@/components/common";
import useModalStore from "@/stores/useModalSotre";
import {useGameStore} from "@/components/game";
import {Button, Input} from "@/components/ui";

import styles from './Settings.module.css';
import useWebSocketStore from "@/stores/useWebSocketStore";

const Settings: FC = () => {
    const {
        isSettingsOpened,
        closeSettings,
    } = useModalStore((state) => ({
        isSettingsOpened: state.isSettingsOpened,
        closeSettings: state.closeSettings,
    }));

    const {
        telegramInitData,
        isVibrationOn,
        toggleVibration,
        userName,
        setUserName,
        wallet,
    } = useGameStore((state) => ({
        telegramInitData: state.telegramInitData,
        isVibrationOn: state.isVibrationOn,
        toggleVibration: state.toggleVibration,
        userName: state.userName,
        setUserName: state.setUserName,
        wallet: state.wallet,
    }));

    const {
        lastMessage,
        updateProfile,
    } = useWebSocketStore((state) => ({
        lastMessage: state.lastMessage,
        updateProfile: state.updateProfile
    }));

    const [nickname, setNickname] = useState(userName);
    const [isResetStarted, setIsResetStarted] = useState(false);
    const [hostname, setHostname] = useState('192.168.100.5');
    const [isDeveloper, setIsDeveloper] = useState(false);

    useEffect(() => {
        setNickname(userName)
    }, [userName]);

    const handlerNicknameInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        const regex = /^[A-Za-z0-9 ]*$/;

        if (!regex.test(value)) return;

        setNickname(evt.target.value);
    };

    const handlerSubmitChangeNickname = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const regex = /[1-9A-HJ-NP-Za-km-z]{32,44}/;

        if (!regex.test(nickname)) return;

        updateProfile({nickname: nickname});
    };

    const handlerSubmitReset = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;

        if (value.toLowerCase() !== 'reset') return;

        localStorage.removeItem('jwt');
        window.location.reload();
    };

    const handlerSwitchToLocalClick = () => {
        const currentUrl = new URL(window.location.href);

        currentUrl.hostname = hostname
        currentUrl.port = '3000';
        currentUrl.protocol = 'http';

        window.location.href = currentUrl.href;
    };

    useEffect(() => {
        if (!lastMessage) return;

        const response = JSON.parse(lastMessage);

        if (response.id !== 5000) return;
        console.log('nres', response);
        if (!response.result.nickname) return;

        setUserName(response.result.nickname);
        console.log('[LOG]: Nickname was updated successfully ', response.result.nickname);
    }, [lastMessage]);

    useEffect(() => {
        const ALLOWED_USERS = [6202760963];
        const params = new URLSearchParams(telegramInitData || '');
        const user = params.get('user');

        if (!user) return;

        const userId = JSON.parse(user).id;

        setIsDeveloper(ALLOWED_USERS.includes(userId));
    }, [telegramInitData])

    return <Modal isOpen={isSettingsOpened} closeModal={closeSettings}>
        <div className={styles.title}>Settings</div>

        <div className={styles.items}>
            <div className={styles.item}>
                Vibration
                <Button onClick={toggleVibration}
                        isLight={isVibrationOn}>{typeof window !== 'undefined' && isVibrationOn ? 'on' : 'off'}</Button>
            </div>

            <form className={styles.item} onSubmit={handlerSubmitChangeNickname}>
                <Input type={"text"} value={nickname} onChange={handlerNicknameInput}/>
                <Button isLight={true} type="submit" disabled={userName === nickname}>Change</Button>
            </form>

            <div className={styles.item}>
                Wallet
                {wallet && <span>{wallet.slice(0, 4) + '...' + wallet.slice(-5, -1)}</span>}
                {!wallet && <WalletConnectButton size={'big'}/>}
            </div>

            <div className={clsx(styles.item, styles.itemVertical)}>
                Have some issue with authorisation?
                {!isResetStarted && <Button className={styles.resetButton} onClick={() => setIsResetStarted(true)}>Reset
                    account</Button>}
                {isResetStarted && <>
                    <div className={styles.warning}>
                        Are you sure? You may lose your progress.
                    </div>
                    <Input placeholder={'type here - reset'} onChange={handlerSubmitReset}/>
                </>}
            </div>
            {isDeveloper &&
                <div className={clsx(styles.item, styles.itemVertical)}>
                    Switch to local project
                    <div style={{display: 'flex', gap: '10px', width:'100%'}}>
                        <Input  placeholder={'enter hostname'} onChange={(evt) => setHostname(evt.target.value)} value={hostname}/>
                        <Button onClick={handlerSwitchToLocalClick} style={{width: '100%'}} isLight={true}>
                            Go
                        </Button>
                    </div>
                </div>
            }
        </div>
    </Modal>
};

export default Settings;
