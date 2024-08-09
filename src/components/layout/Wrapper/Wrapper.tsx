import React, {FC, PropsWithChildren} from "react";

import styles from './Wrapper.module.css';

const Wrapper: FC<PropsWithChildren> = ({children}) => {
    return <div className={styles.root}>
        {children}
    </div>
};

export default Wrapper;
