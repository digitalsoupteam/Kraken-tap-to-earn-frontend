import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import totalPoints from "@/components/game/TotalPoints/TotalPoints";

interface GameStore {
    telegramInitData: string;
    setTelegramInitData: (initData: string) => void;
    userId: string;
    setUserId: (userId: string) => void;
    userPhoto: string;
    setUserPhoto: (photo: string) => void;
    totalPoints: number;
    multiplier: number;
    increasePoints: () => void;
    setTotalPoints: (totalPoints: number) => void;
    sessionLeft: number;
    setSessionLeft: (sessionLeft: number) => void;
    calmUntil: number;
    setCalmUntil: (calmUntil: number) => void;
    sessionUntil: number;
    setSessionUntil: (sessionUntil: number) => void;
    sessionStart: number;
    setSessionStart: (sessionStart: number) => void;
}

const useGameStore = create<GameStore>()(
    devtools(
        (set: (partial: Partial<GameStore>) => void, get: () => GameStore) => ({
            telegramInitData: '',
            setTelegramInitData: (initData: string) => set({telegramInitData: initData}),
            userId: '',
            setUserId: (userId: string) => set({userId: userId}),
            userPhoto: '',
            setUserPhoto: (photo: string) => set({userPhoto: photo}),
            totalPoints: 0,
            multiplier: 1,
            increasePoints: () => {
                const { totalPoints, multiplier } = get();
                set({ totalPoints: parseFloat((totalPoints + multiplier).toFixed(1)) });
            },
            setTotalPoints: (totalPoints: number) => set({totalPoints: totalPoints}),
            sessionLeft: 0,
            setSessionLeft: (sessionLeft: number) => set({sessionLeft: sessionLeft}),
            calmUntil: 0,
            setCalmUntil: (calmUntil: number) => set({calmUntil: calmUntil}),
            sessionUntil: 0,
            setSessionUntil: (sessionUntil: number) => set({sessionUntil: sessionUntil}),
            sessionStart: 0,
            setSessionStart: (sessionStart: number) => set({sessionStart: sessionStart}),
        })
    )
);

export default useGameStore;
