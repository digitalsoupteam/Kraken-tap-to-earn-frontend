import React, {FC, PropsWithChildren} from 'react';

import styles from './BottomBar.module.css';

const BottomBar: FC<PropsWithChildren> = ({children}) => {
    return <div className={styles.root}>
        <div className={styles.inner}>
            {children}
        </div>
    </div>
};

export default BottomBar;
