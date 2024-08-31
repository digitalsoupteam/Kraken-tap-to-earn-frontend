import React, {FC} from 'react';
import Image from "next/image";

import styles from './UserImage.module.css';

interface UserImageProps {
    image?: string;
    letter: string;
}

const UserImage: FC<UserImageProps> = ({image, letter}) => {
    return <div className={styles.root}>
        {!image && letter && <span>{letter}</span>}

        {image && <Image src={image} width="100" height="100" alt='User photo' />}

        {!image && !letter && <Image src={'/images/kraken.svg'} width="100" height="100" alt='User photo' />}
    </div>
};

export default UserImage;
