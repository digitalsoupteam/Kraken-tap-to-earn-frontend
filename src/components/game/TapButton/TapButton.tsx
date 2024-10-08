'use client';

import React, {FC, useState, useRef, useEffect} from 'react';
import WebApp from "@twa-dev/sdk";
import {motion} from 'framer-motion';
import useSound from 'use-sound';

import KrakenBottomImage from '/public/images/kraken.svg';
import KrakenSeasideImage from '/public/images/kraken-smirking.svg';
import KrakenTroposphereImage from '/public/images/kraken-smiling.svg';
import KrakenOuterSpaceImage from '/public/images/kraken-rock.svg';
import {useGameStore} from '@/components/game';
import useWebSocketStore from "@/stores/useWebSocketStore";

import styles from './TapButton.module.css';

const krakens = [
    <KrakenBottomImage key={'first-level'}/>,
    <KrakenSeasideImage key={'second-level'}/>,
    <KrakenTroposphereImage key={'third-level'}/>,
    <KrakenOuterSpaceImage key={'fourth-level'}/>,
];

const TapButton: FC = () => {
    const [playSound] = useSound('/sounds/tap.wav');
    const tapEffectDuration = 500;
    const [taps, setTaps] = useState<{ id: number, x: number, y: number }[]>([]);
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isDisabled, setIsDisabled] = useState(true);

    const {
        multiplier,
        setTotalPoints,
        sessionLeft,
        setSessionLeft, sessionUntil,
        setSessionUntil,
        setSessionStart,
        setCalmUntil,
        isVibrationOn,
        level,
    } = useGameStore((state) => ({
        multiplier: state.multiplier,
        setTotalPoints: state.setTotalPoints,
        sessionLeft: state.sessionLeft,
        setSessionLeft: state.setSessionLeft,
        sessionUntil: state.sessionUntil,
        setSessionUntil: state.setSessionUntil,
        setSessionStart: state.setSessionStart,
        setCalmUntil: state.setCalmUntil,
        isVibrationOn: state.isVibrationOn,
        level: state.level,
    }));

    const {
        sendMessage,
        lastMessage
    } = useWebSocketStore((state) => ({
        sendMessage: state.sendMessage,
        lastMessage: state.lastMessage
    }));

    const handleTap = (clientX: number, clientY: number, touchIdentifier?: number) => {
        playSound();

        const id = Date.now() + (touchIdentifier || 0);

        const buttonRect = buttonRef.current?.getBoundingClientRect();
        if (!buttonRect) return;

        const x = clientX - buttonRect.left;
        const y = clientY - buttonRect.top;

        const message = {
            jsonrpc: '2.0',
            id: 2000,
            method: 'sendTaps',
            params: [{
                x,
                y,
            }],
        };

        console.log(`[LOG]: Call sendTaps method, with data`, message);
        sendMessage(JSON.stringify(message));

        if (typeof window !== 'undefined') {
            isVibrationOn && WebApp.HapticFeedback.impactOccurred('heavy');
        }

        setTaps(prev => [...prev, {id, x, y}]);

        setTimeout(() => {
            setTaps((prev) => prev.filter(tap => tap.id !== id));
        }, tapEffectDuration);
    };

    const handleTouch = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (isDisabled) return;

        if (!isTouchDevice) return;

        Array.from(e.touches).forEach(touch => {
            handleTap(touch.clientX, touch.clientY, touch.identifier);
        });
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) return;

        if (isTouchDevice) return;

        handleTap(e.clientX, e.clientY);
    };

    useEffect(() => {
        if (!lastMessage) return;
        const response = JSON.parse(lastMessage);

        if (response.id != 2000) return

        console.log(`[LOG]: Receive sendTaps data`, response);
        if (
            !response ||
            !response.result ||
            !response.result.userInfo
        )
            return;

        const userInfoFromTap = response.result.userInfo;
        console.log(`[LOG]: Parse user from sendTaps data`, userInfoFromTap);

        setTotalPoints(parseFloat(userInfoFromTap.points.toFixed(1)));
        setSessionLeft(userInfoFromTap.sessionLeft);
        setSessionStart(userInfoFromTap.sessionStart);
        setSessionUntil(userInfoFromTap.sessionUntil);
        setCalmUntil(userInfoFromTap.calmUntil);
    }, [lastMessage]);

    useEffect(() => {
        setIsDisabled(!sessionLeft);
    }, [sessionLeft]);

    return <div className={styles.root}>
        <button className={styles.button} ref={buttonRef} onTouchStart={handleTouch} onClick={handleClick}
                disabled={isDisabled}>
            <motion.span className={styles.buttonInner}
                         whileTap={isDisabled ? {} : {scale: 0.9, transition: {duration: 0.3}}}>
                <span className={styles.image}>
                    <span className={styles.buttonBg}/>
                    {krakens[level]}
                </span>
            </motion.span>
        </button>

        {taps.map((tap) => (
            <motion.div
                key={tap.id}
                className={styles.tapEffect}
                initial={{opacity: 1, y: -20}}
                animate={{opacity: 0, y: -100}}
                transition={{duration: tapEffectDuration / 1000}}
                style={{top: tap.y, left: tap.x}}
            >
                +{multiplier}
            </motion.div>
        ))}
    </div>
};

export default TapButton;
