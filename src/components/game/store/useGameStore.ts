import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {util} from "protobufjs";
import float = util.float;

interface GameStore {
    totalPoints: number;
    multiplier: number;
    increasePoints: () => void;
}

const useGameStore = create<GameStore>()(
    devtools(
        (set: (partial: Partial<GameStore>) => void, get: () => GameStore) => ({
            totalPoints: 100,
            multiplier: 1.1,
            increasePoints: () => {
                const { totalPoints, multiplier } = get();
                set({ totalPoints: parseFloat((totalPoints + multiplier).toFixed(1)) });
            },
        })
    )
);

export default useGameStore;
