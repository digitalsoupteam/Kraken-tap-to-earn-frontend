'use client';

import React, {FC, useEffect, PropsWithChildren} from 'react';
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

    const nativeInitData = typeof window !== 'undefined' ? WebApp.initData : null;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
            WebApp.disableVerticalSwipes();

            const logData = {
                platform: WebApp.platform,
                initData: WebApp.initData,
                storedInitData: telegramInitData,
            };
            console.log('[LOG]: Initial data: ', logData);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && nativeInitData) {
            setTelegramInitData(WebApp.initData);

            const params = new URLSearchParams(telegramInitData || '');
            const userPhotoUrl = params.get('photo_url');

            userPhotoUrl && setUserPhoto(userPhotoUrl);
        }
    }, [nativeInitData]);

    return <>
        {children}
    </>
};

export default TelegramWebApp;
