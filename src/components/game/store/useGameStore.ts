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
        })
    )
);

export default useGameStore;
