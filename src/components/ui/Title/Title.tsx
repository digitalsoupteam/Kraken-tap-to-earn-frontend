import React, {FC} from 'react';
import clsx from "clsx";

import styles from './Title.module.css';

interface TitleProps {
    className?: string;
    title: string;
    titleAccent: string;
    size?: 'big' | 'medium';
}

const Title: FC<TitleProps> = ({title, titleAccent, className, size = 'medium'}) => {
    return <h1 className={clsx(styles.root, className, size && styles[size])} data-text={title}>
        <span className={styles.title}>{title}</span>
        <span className={styles.accent}>{titleAccent}</span>
    </h1>
};

export default Title;
