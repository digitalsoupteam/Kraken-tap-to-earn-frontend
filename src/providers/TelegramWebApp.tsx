'use client';

import React, {FC, useEffect, PropsWithChildren} from 'react';
import WebApp from "@twa-dev/sdk";
import {useGameStore} from "@/components/game";

const TelegramWebApp: FC<PropsWithChildren> = ({children}) => {
    const {
        setTelegramInitData,
        setUserPhoto,
    } = useGameStore((state) => ({
        setTelegramInitData: state.setTelegramInitData,
        setUserPhoto: state.setUserPhoto,
    }));

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
            WebApp.disableVerticalSwipes();

            setTelegramInitData(WebApp.initData);

            const params = new URLSearchParams(WebApp.initData || '');
            const userPhotoUrl = params.get('photo_url');

            userPhotoUrl && setUserPhoto(userPhotoUrl);
        }
    }, []);

    return <>
        {children}
    </>
};

export default TelegramWebApp;
