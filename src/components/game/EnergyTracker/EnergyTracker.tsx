'use client';

import React, {FC, useEffect, useState} from 'react';
import clsx from 'clsx';

import EnergyIcon from '/public/images/energy.svg';

import styles from './EnergyTracker.module.css';
import Image from "next/image";
import {useGameStore} from "@/components/game";
import useWebSocketStore from "@/stores/useWebSocketStore";

const EnergyTracker: FC = () => {
        const {
            calmUntil,
            sessionUntil,
            sessionStart,
            sessionLeft,
            timeOffset,
            setTimeOffset,
            setCalmUntil,
        } = useGameStore((state) => ({
            calmUntil: state.calmUntil,
            sessionUntil: state.sessionUntil,
            sessionStart: state.sessionStart,
            sessionLeft: state.sessionLeft,
            timeOffset: state.timeOffset,
            setTimeOffset: state.setTimeOffset,
            setCalmUntil: state.setCalmUntil,
        }));

        const {
            getUser,
            lastMessage
        } = useWebSocketStore((state) => ({
            getUser: state.getUser,
            lastMessage: state.lastMessage,
        }));

        const [calmTime, setCalmTime] = useState('00:00');
        const [sessionTime, setSessionTime] = useState('00:00');
        const [isEnergyFull, setIsEnergyFull] = useState(false);
        const [isSessionActive, setIsSessionActive] = useState(false);
        const [energy, setEnergy] = useState(100);
        const [currentTime, setCurrentTime] = useState(0);

        const padWithZero = (number: number): string => {
            return number < 10 ? `0${number}` : number.toString();
        }

        // sessionLeft - contains data of the previous tap. If used for timer, an extra tap will be available
        // sessionStart - always not equal to 0
        // sessionUntil - not reset before recovery
        // calmUntil - reset after recovery

        // Current time
        useEffect(() => {
            const timer = setInterval(() => {
                setCurrentTime(Math.floor(Date.now() / 1000) + timeOffset);
            }, 1000);

            return () => clearInterval(timer);
        }, [timeOffset]);

        // Time offset update
        useEffect(() => {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const currentTimeOffset = sessionLeft === 120 ? sessionStart - currentTimestamp : Number(localStorage.getItem('timeOffset'));

            timeOffset !== currentTimeOffset && setTimeOffset(currentTimeOffset);
        }, [sessionLeft, sessionStart]);

        // Session active update
        useEffect(() => {
            setIsSessionActive(currentTime < sessionUntil);
        }, [currentTime, sessionUntil]);

        useEffect(() => {
            getUser();
        }, [isSessionActive]);

        // Energy full update
        useEffect(() => {
            setIsEnergyFull(energy === 100);
        }, [energy]);

        // Active session action
        useEffect(() => {
            if (!isSessionActive) return;

            const totalDuration = sessionUntil - sessionStart;

            if (currentTime >= sessionUntil) {
                setEnergy(0);
                return;
            }

            const remainingTime = sessionUntil - currentTime;
            const minutes = padWithZero(Math.floor(remainingTime / 60));
            const seconds = padWithZero(remainingTime % 60);
            const remainingEnergy = (remainingTime / totalDuration) * 100;

            setSessionTime(`${minutes}:${seconds}`);
            setEnergy(remainingEnergy);

        }, [sessionUntil, sessionStart, currentTime, isSessionActive]);

        // Restore energy action
        useEffect(() => {
            if (isSessionActive) return;

            const totalDuration = calmUntil - sessionUntil;

            if (currentTime >= calmUntil) {
                setEnergy(100);
                return;
            }

            const timeDifference = calmUntil - currentTime;
            const minutes = padWithZero(Math.floor(timeDifference / 60));
            const seconds = padWithZero(timeDifference % 60);
            const currentEnergy = (timeDifference / totalDuration) * 100;

            setCalmTime(`${minutes}:${seconds}`);
            setEnergy(currentEnergy);

        }, [calmUntil, currentTime, isSessionActive]);

        useEffect(() => {
            if (!lastMessage) return;

            const response = JSON.parse(lastMessage);

            if (response.id !== 1000) return;

            setCalmUntil(response.result.calm_until);
        }, [lastMessage]);

        return <div className={styles.root}>
            <div className={styles.inner}>
                <div className={styles.tentacles}>
                    <div
                        className={clsx(styles.tentaclesItem, styles.tentaclesLeft, isEnergyFull && styles.tentaclesItemShow)}>
                        <Image src={'/images/tentacles-1.png'} width={'74'} height={'33'} alt={'kraken tentacles'}/>
                    </div>
                    <div
                        className={clsx(styles.tentaclesItem, styles.tentaclesRight, isEnergyFull && styles.tentaclesItemShow)}>
                        <Image src={'/images/tentacles-2.png'} width={'76'} height={'73'} alt={'kraken tentacles'}/>
                    </div>
                </div>

                <div className={clsx(styles.time, !isSessionActive && isEnergyFull && styles.timeCentered)}>
                <span className={styles.energy}>
                    <EnergyIcon/>
                    2 min
                </span>

                    {!isEnergyFull && !isSessionActive && <span>full restore: {calmTime}</span>}

                    {isSessionActive && <span>Time remaining: {sessionTime}</span>}
                </div>

                <div className={styles.tracker}>
                    <div className={styles.bar}>
                        <div className={styles.progress} style={{width: `${energy}%`}}/>
                    </div>
                </div>
            </div>
        </div>
    }
;

export default EnergyTracker;
