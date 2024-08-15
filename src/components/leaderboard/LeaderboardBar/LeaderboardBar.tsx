import React, {FC} from 'react';

import {BottomBar} from "@/components/common";
import {UserProfile} from "@/components/leaderboard";

const LeaderboardBar: FC = () => {
    return <BottomBar>
        <UserProfile />
    </BottomBar>
};

export default LeaderboardBar;
