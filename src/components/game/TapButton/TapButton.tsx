'use client';

import React, {FC, useState, useRef, useEffect} from 'react';
import {motion} from 'framer-motion';

import KrakenBottomImage from '/public/images/kraken.svg';
import KrakenSeasideImage from '/public/images/kraken-smirking.svg';
import KrakenTroposphereImage from '/public/images/kraken-smiling.svg';
import KrakenOuterSpaceImage from '/public/images/kraken-rock.svg';
import {useGameStore} from '@/components/game';

import styles from './TapButton.module.css';
import useWebSocketStore from "@/stores/useWebSocketStore";
import {sendMessage} from "@trezor/connect-web/lib/webextension/extensionPermissions";

const TapButton: FC = () => {
    const tapEffectDuration = 500;
    const [taps, setTaps] = useState<{ id: number, x: number, y: number }[]>([]);
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const buttonRef = useRef<HTMLButtonElement>(null);

    const {multiplier, increasePoints, sessionLeft, setSessionLeft} = useGameStore((state) => ({
        multiplier: state.multiplier,
        increasePoints: state.increasePoints,
        sessionLeft: state.sessionLeft,
        setSessionLeft: state.setSessionLeft,
    }));

    const isDisabled = !sessionLeft;
    console.log(sessionLeft, isDisabled);

    const {
        sendMessage,
        lastMessage
    } = useWebSocketStore((state) => ({
        sendMessage: state.sendMessage,
        lastMessage: state.lastMessage
    }));

    const handleTap = (clientX: number, clientY: number, touchIdentifier?: number) => {
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

        setTaps(prev => [...prev, {id, x, y}]);

        increasePoints();

        setTimeout(() => {
            setTaps((prev) => prev.filter(tap => tap.id !== id));
        }, tapEffectDuration);
    };

    const handleTouch = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (!isTouchDevice) {
            return;
        }

        Array.from(e.touches).forEach(touch => {
            handleTap(touch.clientX, touch.clientY, touch.identifier);
        });
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isTouchDevice) {
            return;
        }

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

        setSessionLeft(userInfoFromTap.session_left);
        console.log(`[LOG]: Setting sessionLeft`, userInfoFromTap.session_left);
    }, [lastMessage]);

    return <div className={styles.root}>
        <button className={styles.button} ref={buttonRef} onTouchStart={handleTouch} onClick={handleClick} disabled={isDisabled}>
            <motion.span className={styles.buttonInner} whileTap={isDisabled ? {} : {scale: 0.9, transition: {duration: 0.3}}}>
                <span className={styles.image}>
                    <span className={styles.buttonBg}/>
                    <KrakenBottomImage/>
                    {/*<KrakenSeasideImage/>*/}
                    {/*<KrakenTroposphereImage/>*/}
                    {/*<KrakenOuterSpaceImage/>*/}
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
