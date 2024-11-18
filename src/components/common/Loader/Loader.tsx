'use client'

import React, {FC, useState, useEffect} from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import {motion} from 'framer-motion'
import {ReadyState} from 'react-use-websocket';

import useWebSocketStore from "@/stores/useWebSocketStore";

import styles from './Loader.module.css';
import {Button, Spinner, Title} from "@/components/ui";
import {useGameStore} from "@/components/game";

const Loader: FC = () => {
    const [loadingPercent, setLoadingPercent] = useState(0);
    const {gameIsReady, setGameIsReady} = useGameStore((state) => ({
        gameIsReady: state.gameIsReady,
        setGameIsReady: state.setGameIsReady,
    }));
    const {connectionDelay, readyState} = useWebSocketStore((state) => ({
        connectionDelay: state.connectionDelay,
        readyState: state.readyState,
    }));

    const TARGET_PERCENT = 99;

    const closeLoader = () => {
        if (loadingPercent < TARGET_PERCENT || readyState !== ReadyState.OPEN) return;

        setGameIsReady(true);
    };

    useEffect(() => {
        if (gameIsReady) return;

        if (!connectionDelay) return;

        const interval = setInterval(() => {
            setLoadingPercent(prev => {
                if (prev >= TARGET_PERCENT) {
                    clearInterval(interval);
                    return TARGET_PERCENT;
                }
                return prev + Math.floor(Math.random() * 5);
            });
        }, connectionDelay / 20);
        return () => clearInterval(interval);
    }, [connectionDelay]);

    if (readyState === ReadyState.OPEN && gameIsReady) return null;

    const isUnderMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

    return <section className={clsx(styles.root, gameIsReady && styles.closed)}
                    onClick={isUnderMaintenance ? undefined : closeLoader}>
        <Image className={styles.logo} src={"/images/logo.png"} width={"300"} height={"100"} alt={""}/>

        <div className={styles.container}>
            {loadingPercent < TARGET_PERCENT &&
                <>
                    <Spinner/>
                    <span className={styles.loading}>{loadingPercent.toString().padStart(2, '0')}% Loading</span>
                </>
            }
            {loadingPercent >= TARGET_PERCENT && (
                isUnderMaintenance ? (
                    <div className={styles.maintenance}>
                        <Title title="Technical works" titleAccent="" size="big"/>
                        <span className={styles.maintenanceText}>The game is still available, but various slowdowns may occur. Thanks for understanding.</span>
                        <Button isLight={true} onClick={closeLoader}>Ok</Button>
                    </div>
                ) : (
                    <motion.div
                        animate={{scale: [1, 1.2, 1]}}
                        transition={{duration: 1.5, ease: "easeInOut", repeat: Infinity}}
                    >
                        <Title title="Tap and go" titleAccent="into space" size="big"/>
                    </motion.div>
                )
            )}
        </div>
    </section>
};

export default Loader;
