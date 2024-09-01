'use client';

import React, {FC, useEffect, PropsWithChildren} from 'react';
import eruda from 'eruda'
import WebApp from "@twa-dev/sdk";
import {useGameStore} from "@/components/game";

const TelegramWebApp: FC<PropsWithChildren> = ({children}) => {
    const {
        telegramInitData,
        setTelegramInitData,
        setUserPhoto,
    } = useGameStore((state) => ({
        telegramInitData: state.telegramInitData,
        setTelegramInitData: state.setTelegramInitData,
        setUserPhoto: state.setUserPhoto,
    }));

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();

            setTelegramInitData(WebApp.initData);

            const params = new URLSearchParams(telegramInitData || '');
            const userPhotoUrl = params.get('photo_url');
            userPhotoUrl && setUserPhoto(userPhotoUrl);
        }
    }, []);

    eruda.init();

    return <>
        {children}
    </>
};

export default TelegramWebApp;
