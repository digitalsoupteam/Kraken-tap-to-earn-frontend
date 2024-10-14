'use client';
import React, { FC, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import DiamondPointsIcon from '/public/images/diamond-points.svg';
import CrossIcon from '/public/images/cross-mini.svg';
import { useGameStore } from "@/components/game";

import styles from './TotalPoints.module.css';

const TotalPoints: FC = () => {
    const { totalPoints, multiplier } = useGameStore((state) => ({
        totalPoints: state.totalPoints,
        multiplier: state.multiplier,
    }));

    const [displayedPoints, setDisplayedPoints] = useState(totalPoints.toString());
    const motionTotalPoints = useMotionValue(totalPoints);
    const springTotalPoints = useSpring(motionTotalPoints, {
        stiffness: 100,
        damping: 20,
    });

    useEffect(() => {
        motionTotalPoints.set(totalPoints);
    }, [totalPoints]);

    useEffect(() => {
        return springTotalPoints.onChange((value) => {
            setDisplayedPoints(Number(value).toFixed(1));
        });
    }, [springTotalPoints]);

    return (
        <div className={styles.root}>
            <DiamondPointsIcon className={styles.icon} />

            <motion.span className={styles.value}>
                {displayedPoints}
            </motion.span>

            <span className={styles.multiplier}>
                <CrossIcon /> {multiplier}
            </span>
        </div>
    );
};

export default TotalPoints;
