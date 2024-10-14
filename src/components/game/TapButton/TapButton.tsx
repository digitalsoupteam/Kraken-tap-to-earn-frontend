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
    const [isDisabled, setIsDisabled] = useState(true);
    const tapQueueRef = useRef<{ x: number, y: number }[]>([]);
    const tapCooldown = 800;
    // const [tapsCounter, setTapsCounter] = useState(0);
    // const [resCounter, setResCounter] = useState(0);
    // const [prevPayload, setPrevPayload] = useState<{ x: number, y: number }[]>([]);
    // const [allPayload, setAllPayload] = useState<{ x: number, y: number }[][]>([]);

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
        sendTaps,
        lastMessage,
        // sendTapsCount
    } = useWebSocketStore((state) => ({
        sendTaps: state.sendTaps,
        lastMessage: state.lastMessage,
        // sendTapsCount: state.sendTapsCount
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

        tapQueueRef.current.push({x: clientX, y: clientY});

        if (isVibrationOn && typeof window !== 'undefined') {
            WebApp.HapticFeedback.impactOccurred('heavy');
        }

        setTaps(prevTaps => [...prevTaps, {id: Date.now(), x: clientX, y: clientY, startTime: performance.now()}]);
    };


    const sendQueuedTaps = () => {
        if (tapQueueRef.current.length > 0) {
            sendTaps(tapQueueRef.current);
            // setPrevPayload(tapQueueRef.current);
            tapQueueRef.current = [];
        }
    };

    const handledTouchIds = useRef<Set<number>>(new Set());

    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (isDisabled || !isTouchDevice) return;


        Array.from(e.touches).forEach(touch => {
            if (!handledTouchIds.current.has(touch.identifier)) {
                handledTouchIds.current.add(touch.identifier);
                handleTap(touch.clientX, touch.clientY, touch.identifier);
                // setTapsCounter(prev => prev + 1);
            }
        });
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
        Array.from(e.changedTouches).forEach(touch => {
            handledTouchIds.current.delete(touch.identifier);
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
        // setResCounter(prev => prev + 1);
        const userInfoFromTap = response?.result?.userInfo;

        if (!userInfoFromTap) return;
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
        const interval = setInterval(sendQueuedTaps, tapCooldown);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const animationFrame = requestAnimationFrame(drawTapEffects);
        return () => cancelAnimationFrame(animationFrame);
    }, [taps]);


    // useEffect(() => {
    //     if (prevPayload.length > 0) {
    //         setAllPayload(prev => [...prev, prevPayload]);
    //     }
    // }, [prevPayload]);

    return (
        <div className={styles.root}>
            {/*<div*/}
            {/*    style={{*/}
            {/*        position: 'fixed',*/}
            {/*        top: '100px',*/}
            {/*        left: '50px',*/}
            {/*    }}*/}
            {/*>*/}
            {/*    taps - {tapsCounter}*/}
            {/*    <br/>*/}
            {/*    <br/>*/}
            {/*    sendTaps - {sendTapsCount}*/}
            {/*    <br/>*/}
            {/*    <br/>*/}
            {/*    resCounter - {resCounter}*/}
            {/*    <br/>*/}
            {/*    <br/>*/}
            {/*    payload:*/}
            {/*    <div>allPayload - {allPayload.flat().length}</div>*/}
            {/*    <div>prevPayload - {prevPayload.length}</div>*/}
            {/*    {prevPayload.length > 0 && prevPayload.map((item, index) => (*/}
            {/*        <>*/}
            {/*            /!*<div key={item.x + index + item.y}>{index} - {item.x} {item.y}</div>*!/*/}
            {/*        </>*/}
            {/*    ))}*/}
            {/*    <textarea*/}
            {/*        style={{position: 'relative', zIndex: 999, height: 300}}*/}
            {/*        value={allPayload*/}
            {/*            .map((innerArray, index) =>*/}
            {/*                `${index}: [${innerArray.map(item => `{x: ${item.x}, y: ${item.y}}`).join(', ')}]`*/}
            {/*            )*/}
            {/*            .join('\n')}/>*/}
            {/*</div>*/}

            <button
                className={styles.button}
                ref={buttonRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={handleClick}
                disabled={isDisabled}>
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
                width={typeof window !== 'undefined' ? window.innerWidth : buttonRef.current?.offsetWidth}
                height={typeof window !== 'undefined' ? window.innerHeight : buttonRef.current?.offsetHeight}
            />
        </div>
    );
};

export default TapButton;
