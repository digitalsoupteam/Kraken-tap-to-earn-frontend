import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import WebApp from "@twa-dev/sdk";

interface User {
    level: number[],
    session_left: number,
    id: number,
    nickname: string,
    session_taps: number,
    isBlocked: boolean,
    sessionTapsLeft: number,
    calm_left: number,
    points: number;
    taps: number,
    calmUntil: number,
    sessionStart: number,
    sessionUntil: number,
}

type State = {
    telegramInitData: string | null;
    userId: string;
    userPhoto: string;
    totalPoints: number;
    userName: string,
    multiplier: number;
    sessionLeft: number;
    calmUntil: number;
    sessionUntil: number;
    sessionStart: number;
    timeOffset: number;
    leadersList: User[];
    leaderboardPosition: number;
    referralsList: User[];
    wallet: string;
    isVibrationOn: boolean;
    levelsGates: number[];
    level: number;
    gameIsReady: boolean;
}

type Action = {
    setTelegramInitData: (initData: string) => void;
    setUserId: (userId: string) => void;
    setUserPhoto: (photo: string) => void;
    setUserName: (name: string) => void,
    setTotalPoints: (totalPoints: number) => void;
    setSessionLeft: (sessionLeft: number) => void;
    setCalmUntil: (calmUntil: number) => void;
    setSessionUntil: (sessionUntil: number) => void;
    setSessionStart: (sessionStart: number) => void;
    setTimeOffset: (timeOffset: number) => void;
    setLeadersList: (leadersList: User[]) => void;
    setLeaderboardPosition: (position: number) => void;
    setReferralsList: (referralsList: User[]) => void;
    setMultiplier: (multiplier: number) => void;
    setWallet: (wallet: string) => void;
    toggleVibration: () => void;
    setLevel: (level: number) => void;
    setGameIsReady: (readiness: boolean) => void;
}

const useGameStore = create<State & Action>()(
    devtools(
        (set, get) => ({
            telegramInitData: null,
            userId: '',
            userPhoto: '',
            userName: '',
            totalPoints: 0,
            multiplier: 1,
            sessionLeft: 0,
            calmUntil: 0,
            sessionUntil: 0,
            sessionStart: 0,
            timeOffset: typeof window !== 'undefined' && Number(localStorage.getItem('timeOffset')) || 0,
            leadersList: [],
            leaderboardPosition: 0,
            referralsList: [],
            wallet: '',
            isVibrationOn: typeof window !== 'undefined' && localStorage.getItem('vibration') ? localStorage.getItem('vibration') === 'on' : true,
            levelsGates : [0, 350000, 850000, 1350000],
            level: 0,
            gameIsReady: false,
            setTelegramInitData: (initData: string) => set({telegramInitData: initData}),
            setUserId: (userId: string) => set({userId: userId}),
            setUserPhoto: (photo: string) => set({userPhoto: photo}),
            setUserName: (name: string) => set({userName: name}),
            setTotalPoints: (totalPoints: number) => set({totalPoints: totalPoints}),
            setSessionLeft: (sessionLeft: number) => set({sessionLeft: sessionLeft}),
            setCalmUntil: (calmUntil: number) => set({calmUntil: calmUntil}),
            setSessionUntil: (sessionUntil: number) => set({sessionUntil: sessionUntil}),
            setSessionStart: (sessionStart: number) => set({sessionStart: sessionStart}),
            setTimeOffset: (timeOffset: number) => {
                set({timeOffset: timeOffset})
                localStorage.setItem('timeOffset', String(timeOffset));
            },
            setLeadersList: (leadersList: User[]) => set({leadersList: leadersList}),
            setLeaderboardPosition: (position: number) => set({leaderboardPosition: position}),
            setReferralsList: (referralsList: User[]) => set({referralsList: referralsList}),
            setMultiplier: (daysInRaw: number) => {
                const baseMultiplier: number = 1;
                const additionalMultiplier = Math.min(daysInRaw / 10, 1);
                set({multiplier: baseMultiplier + additionalMultiplier});
            },
            setWallet: (wallet: string) => set({wallet: wallet}),
            toggleVibration: () => {
                set({ isVibrationOn: !get().isVibrationOn });
                localStorage.setItem('vibration', get().isVibrationOn ? 'on' : 'off');

                if (typeof window !== 'undefined') {
                    get().isVibrationOn && WebApp.HapticFeedback.impactOccurred('heavy');
                }
            },
            setLevel: (level: number) => set({level: level}),
            setGameIsReady: (readiness: boolean) => set({gameIsReady: readiness})
        })
    )
);

export default useGameStore;
