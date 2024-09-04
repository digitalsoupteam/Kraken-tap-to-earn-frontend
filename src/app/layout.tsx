import React, {FC, PropsWithChildren, Suspense} from "react";
import type {Metadata, Viewport} from "next";
import {Bebas_Neue} from "next/font/google";
import localFont from 'next/font/local';
import clsx from "clsx";

import {TelegramWebApp, WebSocket} from "@/providers/";
import {Footer, Header} from "@/components/layout";
import {WalletConnectModal} from "@/components/common";

import "./globals.css";

const BebasNeue = Bebas_Neue({
    weight: '400',
    display: 'swap',
    subsets: ['latin']
});

const DarkHornetItalic = localFont({
    src: [
        {
            path: './fonts/DarkHornetItalic.woff2',
            weight: '400',
            style: 'normal',
        },
    ],
    display: 'swap',
    variable: '--dark-hornet-italic',
});

export const metadata: Metadata = {
    title: "Kraken tap and go into space",
    description: "Kraken tap and go into space",
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

const RootLayout: FC<PropsWithChildren> = ({children}) => {
    return (
        <html lang="en">
        <body className={clsx(BebasNeue.className, DarkHornetItalic.variable)}>
        <Suspense fallback={<div>Loading...</div>}>
            <TelegramWebApp>
                <WebSocket>
                    <Header/>
                    <main>
                        {children}
                    </main>
                    <WalletConnectModal/>
                    <Footer/>
                </WebSocket>
            </TelegramWebApp>
        </Suspense>
        </body>
        </html>
    )
}

export default RootLayout;
