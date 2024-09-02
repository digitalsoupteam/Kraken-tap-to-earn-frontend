import React, {FC} from 'react';

import {BottomBar} from "@/components/common";
import WalletConnectButton from "@/components/common/WalletConnectButton/WalletConnectButton";
import {useGameStore} from "@/components/game";

const QuestsBar: FC = () => {
    const {wallet} = useGameStore((state) => ({wallet: state.wallet}));


    return <BottomBar>
        {!wallet && <WalletConnectButton size={'big'}/>}
    </BottomBar>
};

export default QuestsBar;
