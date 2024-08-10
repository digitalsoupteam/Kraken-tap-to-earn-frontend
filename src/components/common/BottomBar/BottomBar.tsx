import React, {FC, PropsWithChildren} from 'react';

import styles from './BottomBar.module.css';
import {Wrapper} from "@/components/layout";

const BottomBar: FC<PropsWithChildren> = ({children}) => {
    return <div className={styles.root}>
        <Wrapper>
            <div className={styles.inner}>
                {children}
            </div>
        </Wrapper>
    </div>
};

export default BottomBar;
