'use client';

import React, { FC, useState, useRef, useEffect } from 'react';
import WebApp from "@twa-dev/sdk";
import useSound from 'use-sound';
import KrakenBottomImage from '/public/images/kraken.svg';
import KrakenSeasideImage from '/public/images/kraken-smirking.svg';
import KrakenTroposphereImage from '/public/images/kraken-smiling.svg';
import KrakenOuterSpaceImage from '/public/images/kraken-rock.svg';
import { useGameStore } from '@/components/game';
import useWebSocketStore from "@/stores/useWebSocketStore";
import styles from './TapButton.module.css';

const krakens = [
    <KrakenBottomImage key={'first-level'} />,
    <KrakenSeasideImage key={'second-level'} />,
    <KrakenTroposphereImage key={'third-level'} />,
    <KrakenOuterSpaceImage key={'fourth-level'} />,
];

const TapButton: FC = () => {
    const [playSound] = useSound('/sounds/tap.wav');
    const tapEffectDuration = 500;
    const [taps, setTaps] = useState<{ id: number, x: number, y: number, startTime: number }[]>([]);
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const [tapsCounter, setTapsCounter] = useState(0);

    const {
        multiplier,
        setTotalPoints,
        sessionLeft,
        setSessionLeft,
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
        playSound();

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

        sendMessage(JSON.stringify(message));
        if (isVibrationOn && typeof window !== 'undefined') {
            WebApp.HapticFeedback.impactOccurred('heavy');
        }

        setTapsCounter(tapsCounter + 1);
        setTaps(prevTaps => [...prevTaps, { id: Date.now(), x, y, startTime: performance.now() }]);
    };

    const handleTouch = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (isDisabled || !isTouchDevice) return;

        Array.from(e.touches).forEach(touch => {
            handleTap(touch.clientX, touch.clientY, touch.identifier);
        });
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled || isTouchDevice) return;

        handleTap(e.clientX, e.clientY);
    };

    useEffect(() => {
        if (!lastMessage) return;
        const response = JSON.parse(lastMessage);

        if (response.id !== 2000) return;
        const userInfoFromTap = response.result.userInfo;
        setTotalPoints(parseFloat(userInfoFromTap.points.toFixed(1)));
        setSessionLeft(userInfoFromTap.sessionLeft);
        setSessionUntil(userInfoFromTap.sessionUntil);
        setSessionStart(userInfoFromTap.sessionStart);
        setCalmUntil(userInfoFromTap.calmUntil);
    }, [lastMessage]);

    useEffect(() => {
        setIsDisabled(!sessionLeft);
    }, [sessionLeft]);

    useEffect(() => {
        const animationFrame = requestAnimationFrame(drawTapEffects);
        return () => cancelAnimationFrame(animationFrame);
    }, [taps]);

    return (
        <div className={styles.root}>
            <div
                style={{
                    position: 'fixed',
                    top: '50px',
                    left: '50px',
                }}
            >{tapsCounter}</div>

            <button
                className={styles.button}
                ref={buttonRef}
                onTouchEnd={handleTouch}
                onClick={handleClick}
                disabled={isDisabled}>
                <span className={styles.buttonInner}>
                    <span className={styles.image}>
                        <span className={styles.buttonBg} />
                        {krakens[level]}
                    </span>
                </span>
            </button>

            <canvas
                ref={canvasRef}
                className={styles.canvas}
                width={buttonRef.current?.offsetWidth}
                height={buttonRef.current?.offsetHeight}
            />
        </div>
    );
};

export default TapButton;
