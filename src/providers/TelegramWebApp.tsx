'use client';

import React, {FC, useEffect, PropsWithChildren} from 'react';
import WebApp from "@twa-dev/sdk";

const TelegramWebApp: FC<PropsWithChildren> = ({children}) => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
        }
    }, []);

    return <>
        {children}
    </>
};

export default TelegramWebApp;
