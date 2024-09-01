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

    return <>
        {
            typeof window !== 'undefined' && <>
                <div style={{zIndex: 999, position: 'absolute'}}>
                    <button onClick={() => {
                        WebApp.HapticFeedback.notificationOccurred('error')
                    }} style={{padding: 10}}>notificationOccurred - error
                    </button>

                    <button onClick={() => {
                        WebApp.HapticFeedback.notificationOccurred('success')
                    }} style={{padding: 10}}>notificationOccurred - success
                    </button>

                    <button onClick={() => {
                        WebApp.HapticFeedback.notificationOccurred('warning')
                    }} style={{padding: 10}}>notificationOccurred - warning
                    </button>
                </div>
            </>
        }
        {children}
    </>
};

export default TelegramWebApp;
