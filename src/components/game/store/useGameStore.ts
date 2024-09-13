import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import WebApp from "@twa-dev/sdk";

interface User {
    level: number[],
    session_left: number,
    id: number,
    nickname: string,
    session_taps: number,
    is_blocked: boolean,
    session_taps_left: number,
    calm_left: number,
    points: number;
    taps: number,
    calm_until: number,
    session_start: number,
    session_until: number,
    user_id: string;
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
    leadersList: User[];
    referralsList: User[];
    wallet: string;
    isVibrationOn: boolean;
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
    setLeadersList: (leadersList: User[]) => void;
    setReferralsList: (referralsList: User[]) => void;
    setMultiplier: (multiplier: number) => void;
    setWallet: (wallet: string) => void;
    toggleVibration: () => void;
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
            leadersList: [],
            referralsList: [],
            wallet: '',
            isVibrationOn: typeof window !== 'undefined' && localStorage.getItem('vibration') ? localStorage.getItem('vibration') === 'on' : true,
            setTelegramInitData: (initData: string) => set({telegramInitData: initData}),
            setUserId: (userId: string) => set({userId: userId}),
            setUserPhoto: (photo: string) => set({userPhoto: photo}),
            setUserName: (name: string) => set({userName: name}),
            setTotalPoints: (totalPoints: number) => set({totalPoints: totalPoints}),
            setSessionLeft: (sessionLeft: number) => set({sessionLeft: sessionLeft}),
            setCalmUntil: (calmUntil: number) => set({calmUntil: calmUntil}),
            setSessionUntil: (sessionUntil: number) => set({sessionUntil: sessionUntil}),
            setSessionStart: (sessionStart: number) => set({sessionStart: sessionStart}),
            setLeadersList: (leadersList: User[]) => set({leadersList: leadersList}),
            setReferralsList: (referralsList: User[]) => set({referralsList: referralsList}),
            setMultiplier: (daysInRaw: number) => {
                const baseMultiplier: number = 1;

                set({multiplier: baseMultiplier + daysInRaw / 10});
            },
            setWallet: (wallet: string) => set({wallet: wallet}),
            toggleVibration: () => {
                set({ isVibrationOn: !get().isVibrationOn });
                localStorage.setItem('vibration', get().isVibrationOn ? 'on' : 'off');

                if (typeof window !== 'undefined') {
                    WebApp.HapticFeedback.impactOccurred('heavy');
                }
            },
        })
    )
);

export default useGameStore;
