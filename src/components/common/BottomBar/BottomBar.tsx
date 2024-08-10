import React, {FC, PropsWithChildren} from 'react';
import clsx from 'clsx';

import {Wrapper} from "@/components/layout";

import styles from './BottomBar.module.css';

interface BottomBarProps extends PropsWithChildren {
    className?: string;
}

const BottomBar: FC<BottomBarProps> = ({children, className}) => {
    return <div className={clsx(styles.root, className)}>
        <Wrapper>
            <div className={styles.inner}>
                {children}
            </div>
        </Wrapper>
    </div>
};

export default BottomBar;
