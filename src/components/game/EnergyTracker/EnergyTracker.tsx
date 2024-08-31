'use client';

import React, {FC, useEffect, useState} from 'react';
import clsx from 'clsx';

import EnergyIcon from '/public/images/energy.svg';

import styles from './EnergyTracker.module.css';
import Image from "next/image";
import {useGameStore} from "@/components/game";
import useWebSocketStore from "@/stores/useWebSocketStore";

const EnergyTracker: FC = () => {
    const [calmTime, setCalmTime] = useState('00:00');
    const [sessionTime, setSessionTime] = useState('00:00');
    const [isEnergyFull, setIsEnergyFull] = useState(false);
    const [isSessionStart, setIsSessionStart] = useState(false);
    const [energy, setEnergy] = useState(100);

    const {
        calmUntil,
        sessionUntil,
        sessionStart,
    } = useGameStore((state) => ({
        calmUntil: state.calmUntil,
        sessionUntil: state.sessionUntil,
        sessionStart: state.sessionStart,
    }));

    const padWithZero = (number: number): string => {
        return number < 10 ? `0${number}` : number.toString();
    }

    useEffect(() => {
        if (!calmUntil) {
            setIsEnergyFull(true);
            return;
        }

        setIsEnergyFull(false);

        const currentTimestamp = sessionUntil;
        const duration = calmUntil - currentTimestamp;
        const initialTimestamp = currentTimestamp;

        const timer = setInterval(() => {
            const currentTime = Math.floor(Date.now() / 1000);

            if (currentTime >= calmUntil) {
                clearInterval(timer);
                setIsEnergyFull(true);
                setEnergy(100); // Устанавливаем энергию на 100, когда таймер заканчивается
                return;
            }

            const timeDifference = calmUntil - currentTime;
            const minutes = padWithZero(Math.floor(timeDifference / 60));
            const seconds = padWithZero(timeDifference % 60);

            setCalmTime(`${minutes}:${seconds}`);

            const elapsedTime = currentTime - initialTimestamp;
            const currentEnergy = (elapsedTime / duration) * 100;

            setEnergy(currentEnergy); // Устанавливаем энергию на основе прошедшего времени
        }, 1000);

        return () => clearInterval(timer);
    }, [calmUntil]);

    useEffect(() => {
        if (!sessionStart || !sessionUntil) {
            setIsSessionStart(false);
            return;
        }

        setIsEnergyFull(false);
        setIsSessionStart(true);

        const duration = sessionUntil - sessionStart;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const targetTimestamp = currentTimestamp + duration;

        const timer = setInterval(() => {
            const currentTime = Math.floor(Date.now() / 1000);

            if (currentTime >= targetTimestamp) {
                setIsSessionStart(false);
                setEnergy(0);
                clearInterval(timer);
                return;
            }

            const timeDifference = targetTimestamp - currentTime;
            const minutes = padWithZero(Math.floor(timeDifference / 60));
            const seconds = padWithZero(timeDifference % 60);

            setSessionTime(`${minutes}:${seconds}`);

            const elapsed = duration - timeDifference;
            const remainingEnergy = (timeDifference / duration) * 100;

            setEnergy(remainingEnergy);
        }, 1000);

        return () => clearInterval(timer);
    }, [sessionStart, sessionUntil]);

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

            <div className={clsx(styles.time, !isSessionStart && isEnergyFull && styles.timeCentered)}>
                <span className={styles.energy}>
                    <EnergyIcon/>
                    2 min
                </span>

                {!isEnergyFull && !isSessionStart && <span>full restore: {calmTime}</span>}

                {isSessionStart && <span>Time remaining: {sessionTime}</span>}
            </div>

            <div className={styles.tracker}>
                <div className={styles.bar}>
                    <div className={styles.progress} style={{width: `${energy}%`}}/>
                </div>
            </div>
        </div>
    </div>
};

export default EnergyTracker;
