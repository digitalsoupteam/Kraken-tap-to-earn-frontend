import React, {FC} from 'react';
import Image from "next/image";

import styles from './PageHeading.module.css';
import {Title} from "@/components/ui";

interface PageHeadingProps {
    image?: string;
    title: string;
    titleAccent: string;
    size?: 'big' | 'medium';
}

const PageHeading: FC<PageHeadingProps> = ({image, title, titleAccent, size}) => {
    return <section className={styles.root}>
        {
            image && <div className={styles.imageContainer}>
                <Image src={image} width="300" height="100" alt=""/>
            </div>
        }
        <Title title={title} titleAccent={titleAccent} size={size} />
    </section>
};

export default PageHeading;
