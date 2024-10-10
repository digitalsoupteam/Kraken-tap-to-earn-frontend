'use client';

import React, {FC, useEffect} from 'react';

import {Loader} from '@/components/common';
import {GameContainer} from "@/components/game";

const Home: FC = () =>  {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <>
            <Loader />
            <GameContainer/>
        </>
    );
}

export default Home;
