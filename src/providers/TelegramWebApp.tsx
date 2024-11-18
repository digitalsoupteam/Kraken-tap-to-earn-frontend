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

            if (typeof WebApp.initData === 'string') setTelegramInitData(WebApp.initData);

            const userPhotoUrl = WebApp.initDataUnsafe && WebApp.initDataUnsafe.user?.photo_url;

            userPhotoUrl && setUserPhoto(userPhotoUrl);
        }
    }, [setTelegramInitData, setUserPhoto]);

    return <>
        {children}
    </>
};

export default TelegramWebApp;
