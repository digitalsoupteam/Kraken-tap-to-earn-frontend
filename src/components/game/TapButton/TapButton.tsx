'use client';

import React, {FC, useState, useRef, useEffect} from 'react';
import {motion} from 'framer-motion';

import KrakenBottomImage from '/public/images/kraken.svg';
import KrakenSeasideImage from '/public/images/kraken-smirking.svg';
import KrakenTroposphereImage from '/public/images/kraken-smiling.svg';
import KrakenOuterSpaceImage from '/public/images/kraken-rock.svg';
import {useGameStore} from '@/components/game';

import styles from './TapButton.module.css';
import useWebSocket from 'react-use-websocket';
import {useAppStore} from '@/providers/AppStoreProvider';


const TapButton: FC = () => {
    const SEND_TAPS_MESSAGE_ID = 2000
    const {userId} = useAppStore(state => state);

    const {sendMessage, lastMessage, readyState} = useWebSocket(
        process.env.NEXT_PUBLIC_WS_URL ?? 'wss://172.86.75.111:3000/ws',
        {share: true}
    );

    useEffect(() => {
        if (!lastMessage) return;
        const response = JSON.parse(lastMessage.data);
        if(response.id != SEND_TAPS_MESSAGE_ID) return
        console.log(`[LOG]: Receive sendTaps data`, response);
        if (
            !response ||
            !response.result ||
            !response.result[0] ||
            !response.result[0].user_info
        )
            return;
        const userInfoFromTap = response.result[0].user_info;
        console.log(`[LOG]: Parse user from sendTaps data`, userInfoFromTap);
    }, [lastMessage]);

    const tapEffectDuration = 500;
    const [taps, setTaps] = useState<{ id: number, x: number, y: number }[]>([]);
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const increasePoints = useGameStore(state => state.increasePoints);

    const handleTap = (clientX: number, clientY: number, touchIdentifier?: number) => {
        const id = Date.now() + (touchIdentifier || 0);

        const buttonRect = buttonRef.current?.getBoundingClientRect();
        if (!buttonRect) return;

        const x = clientX - buttonRect.left;
        const y = clientY - buttonRect.top;

        const message = {
            jsonrpc: '2.0',
            id: SEND_TAPS_MESSAGE_ID,
            method: 'sendTaps',
            params: {
                userId,
                taps: {
                    x,
                    y,
                },
            },
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

    return <div className={styles.root}>
        <button className={styles.button} ref={buttonRef} onTouchStart={handleTouch} onClick={handleClick}>
            <motion.span className={styles.buttonInner} whileTap={{scale: 0.9, transition: {duration: 0.3}}}>
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
                +1
            </motion.div>
        ))}
    </div>
};

export default TapButton;
