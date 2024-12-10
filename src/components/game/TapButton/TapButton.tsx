'use client';

import React, {FC, useState, useRef, useEffect} from 'react';
import WebApp from "@twa-dev/sdk";
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
    const [taps, setTaps] = useState<{ id: number, x: number, y: number, startTime: number }[]>([]);
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const tapQueueRef = useRef<{ x: number, y: number }[]>([]);
    const firstTapRef = useRef(true);
    const tapCooldown = 800;

    const {
        multiplier,
        setTotalPoints,
        sessionLeft,
        setSessionLeft,
        setSessionUntil,
        setSessionStart,
        setCalmUntil,
        isVibrationOn,
        setMultiplier,
        level,
        isTapDisabled,
        setIsTapDisabled
    } = useGameStore((state) => ({
        multiplier: state.multiplier,
        setTotalPoints: state.setTotalPoints,
        sessionLeft: state.sessionLeft,
        setSessionLeft: state.setSessionLeft,
        setSessionUntil: state.setSessionUntil,
        setSessionStart: state.setSessionStart,
        setCalmUntil: state.setCalmUntil,
        setMultiplier: state.setMultiplier,
        isVibrationOn: state.isVibrationOn,
        level: state.level,
        isTapDisabled: state.isTapDisabled,
        setIsTapDisabled: state.setIsTapDisabled
    }));

    const {
        sendTaps,
        lastMessage,
    } = useWebSocketStore((state) => ({
        sendTaps: state.sendTaps,
        lastMessage: state.lastMessage,
    }));

    const drawTapEffects = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const currentTime = performance.now();

        taps.forEach(tap => {
            const elapsedTime = (currentTime - tap.startTime) / 1000;
            const opacity = Math.max(1 - elapsedTime / (tapEffectDuration / 1000), 0);
            const yOffset = -20 - (80 * elapsedTime);

            const rootStyles = getComputedStyle(document.body);
            const fontFamily = rootStyles.getPropertyValue('--dark-hornet-italic').trim();
            ctx.font = `20px ${fontFamily}`;
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`+${multiplier}`, tap.x, tap.y + yOffset);
        });

        setTaps(prevTaps => prevTaps.filter(tap => (performance.now() - tap.startTime) < tapEffectDuration));
    };

    const handleTap = (clientX: number, clientY: number, touchIdentifier?: number) => {
        if (firstTapRef.current) {
            sendTaps([{x: Math.round(clientX), y: Math.round(clientY)}]);
            firstTapRef.current = false;
        } else {
            tapQueueRef.current.push({x: Math.round(clientX), y: Math.round(clientY)});
        }

        if (isVibrationOn && typeof window !== 'undefined') {
            WebApp.HapticFeedback.impactOccurred('heavy');
        }

        setTaps(prevTaps => [...prevTaps, {id: Date.now(), x: clientX, y: clientY, startTime: performance.now()}]);
    };


    const sendQueuedTaps = () => {
        if (tapQueueRef.current.length > 0) {
            sendTaps(tapQueueRef.current);
            tapQueueRef.current = [];
        }
    };

    const handledTouchIds = useRef<Set<number>>(new Set());

    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (isTapDisabled || !isTouchDevice) return;

        playSound();

        Array.from(e.touches).forEach(touch => {
            if (!handledTouchIds.current.has(touch.identifier)) {
                handledTouchIds.current.add(touch.identifier);
                handleTap(touch.clientX, touch.clientY, touch.identifier);
            }
        });
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
        Array.from(e.changedTouches).forEach(touch => {
            handledTouchIds.current.delete(touch.identifier);
        });
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isTapDisabled || isTouchDevice) return;

        playSound();
        handleTap(e.clientX, e.clientY);
    };

    useEffect(() => {
        if (!lastMessage) return;
        const response = JSON.parse(lastMessage);

        if (response.id !== 2000) return;

        const userInfoFromTap = response?.result?.userInfo;
        if (!userInfoFromTap) return;
        setTotalPoints(parseFloat(userInfoFromTap.points.toFixed(1)));
        setSessionLeft(userInfoFromTap.sessionLeft);
        setSessionUntil(userInfoFromTap.sessionUntil);
        setSessionStart(userInfoFromTap.sessionStart);
        setCalmUntil(userInfoFromTap.calmUntil);
        setMultiplier(userInfoFromTap.daysInRow);
    }, [lastMessage]);

    useEffect(() => {
        setIsTapDisabled(!sessionLeft);
    }, [sessionLeft]);

    useEffect(() => {
        const interval = setInterval(sendQueuedTaps, tapCooldown);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const animationFrame = requestAnimationFrame(drawTapEffects);
        return () => cancelAnimationFrame(animationFrame);
    }, [taps]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (!canvasRef.current) return;

        canvasRef.current.height = window.innerHeight;
        canvasRef.current.width = window.innerWidth;
     }, [canvasRef]);

    return (
        <div className={styles.root}>
            <button
                className={styles.button}
                ref={buttonRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={handleClick}
                disabled={isTapDisabled}>
                <span className={styles.buttonInner}>
                    <span className={styles.image}>
                        <span className={styles.buttonBg}/>
                        {krakens[level]}
                    </span>
                </span>
            </button>

            <canvas
                ref={canvasRef}
                className={styles.canvas}
                width={'300'}
                height={'300'}
            />
        </div>
    );
};

export default TapButton;
