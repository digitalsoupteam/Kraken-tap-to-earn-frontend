'use client'; // This is a client component 👈🏽

import {GameContainer} from '@/components/game';
import {useAppStore} from '@/providers/AppStoreProvider';
import WebApp from '@twa-dev/sdk';
import {useEffect} from 'react';
import useWebSocket from 'react-use-websocket';

export default function Home() {
    return <GameContainer />;
}
