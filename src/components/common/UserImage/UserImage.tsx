import React, {FC} from 'react';
import Image from "next/image";

import styles from './UserImage.module.css';

const UserImage: FC = () => {
    return <div className={styles.root}>
        <Image src={'/images/kraken.svg'} width="100" height="100" alt='User photo' />
    </div>
};

export default UserImage;
