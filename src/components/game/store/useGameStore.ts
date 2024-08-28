import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GameStore {
    userId: string;
    setUserId: (userId: string) => void;
    deviceId: string;
    setDeviceId: (deviceId: string) => void;
    totalPoints: number;
    multiplier: number;
    increasePoints: () => void;
}

const useGameStore = create<GameStore>()(
    devtools(
        (set: (partial: Partial<GameStore>) => void, get: () => GameStore) => ({
            userId: '',
            setUserId: (userId: string) => set({userId: userId}),
            deviceId: '',
            setDeviceId: (deviceId: string) =>  set({deviceId: deviceId}),
            totalPoints: 0,
            multiplier: 1,
            increasePoints: () => {
                const { totalPoints, multiplier } = get();
                set({ totalPoints: parseFloat((totalPoints + multiplier).toFixed(1)) });
            },
        })
    )
);

export default useGameStore;
