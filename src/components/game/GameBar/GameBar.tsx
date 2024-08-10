import React, {FC} from 'react';

import {BottomBar} from "@/components/common";
import {ProgressTracker} from "@/components/game";

const GameBar: FC = () => {
    return <BottomBar>
        <ProgressTracker/>
    </BottomBar>
};

export default GameBar;
