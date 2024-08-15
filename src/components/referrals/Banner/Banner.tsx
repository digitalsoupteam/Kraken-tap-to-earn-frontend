'use client';

import React, {FC} from 'react';
import Image from 'next/image';
import clsx from "clsx";
import {motion} from "framer-motion";

import {Points} from "@/components/common";

import styles from './Banner.module.css';

const Banner: FC = () => {
    const animationDuration = 0.6;

    return <div className={styles.root}>
        <div className={styles.text}>
            Invite a friend and get a reward
            <br/>+ <Points points={20000}/> for you and your friend
        </div>

        <div className={styles.tentacles}>
            <motion.div
                className={clsx(styles.tentaclesItem, styles.tentaclesLeft)}
                initial="hidden"
                whileInView="visible"
                transition={{
                    duration: animationDuration,
                    ease: 'easeInOut',
                }}
                variants={{
                    hidden: {x: '-90%'},
                    visible: {x: 0},
                }}
            >
                <Image src={'/images/tentacles-3.png'} width="82" height="51" alt="kraken tentacles"/>
            </motion.div>
            <motion.div
                className={clsx(styles.tentaclesItem, styles.tentaclesRight)}
                initial="hidden"
                whileInView="visible"
                transition={{
                    duration: animationDuration,
                    ease: 'easeInOut',
                }}
                variants={{
                    hidden: {x: '90%'},
                    visible: {x: 0},
                }}
            >
                <Image src={'/images/tentacles-2.png'} width="76" height="56" alt="kraken tentacles"/>
            </motion.div>
        </div>
    </div>
};

export default Banner;
