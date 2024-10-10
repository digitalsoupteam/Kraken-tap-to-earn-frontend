'use client'

import React, {FC, useState, useEffect} from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import {motion} from 'framer-motion'

import useWebSocketStore from "@/stores/useWebSocketStore";

import styles from './Loader.module.css';
import {Title} from "@/components/ui";

const Loader: FC = () => {
    const [isLoaderClosed, setIsLoaderClosed] = useState(false);
    const [loadingPercent, setLoadingPercent] = useState(0);
    const [gameIsReady, setGameIsReady] = useState(false);
    const {connectionDelay} = useWebSocketStore((state) => ({connectionDelay: state.connectionDelay}));

    const closeLoader = () => {
        if (!gameIsReady) return;

        setIsLoaderClosed(true);
    };

    useEffect(() => {
        if (connectionDelay) {
            const interval = setInterval(() => {
                setLoadingPercent(prev => {
                    if (prev >= 99) {
                        clearInterval(interval);
                        setGameIsReady(true);
                        return 99;
                    }
                    return prev + Math.floor(Math.random() * 5);
                });
            }, connectionDelay / 20);

            return () => clearInterval(interval);
        }
    }, [connectionDelay]);

    return <section className={clsx(styles.root, isLoaderClosed && styles.closed)} onClick={closeLoader}>
        <Image className={styles.logo} src={"/images/logo.png"} width={"300"} height={"100"} alt={""}/>

        <div className={styles.container}>
            {!gameIsReady &&
                <>
                    <Image className={styles.spinner} src={"/images/spinner.png"} width={"110"} height={"110"}
                           alt={"loading"}/>
                    <span className={styles.loading}>{loadingPercent.toString().padStart(2, '0')}% Loading</span>
                </>
            }
            {
                gameIsReady &&
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity}}
                >
                    <Title title={'Tap and go'} titleAccent={'into space'} size={'big'}/>
                </motion.div>
            }
        </div>
    </section>
};

export default Loader;
