import React, {FC} from 'react';
import Image from "next/image";
import { basePath } from '../../../../next.config';

import styles from './UserImage.module.css';

interface UserImageProps {
    image?: string;
}

const UserImage: FC<UserImageProps> = ({image}) => {
    return <div className={styles.root}>
        <Image src={basePath + (image || '/images/kraken.svg')} width="100" height="100" alt='User photo' />
    </div>
};

export default UserImage;
