import React, {FC} from 'react';

import {BottomBar} from "@/components/common";
import CustomWalletConnectButton from "@/components/common/CustomWalletConnectButton/CustomWalletConnectButton";

const QuestsBar: FC = () => {
    return <BottomBar>
        <CustomWalletConnectButton size={'big'}/>
    </BottomBar>
};

export default QuestsBar;
