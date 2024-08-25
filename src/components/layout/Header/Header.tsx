import React, {FC, useState} from 'react';

import {Wrapper} from "@/components/layout";

import styles from './Header.module.css';
import Image from "next/image";
import { basePath } from '../../../../next.config';

const Header: FC = () => {

    return <header className={styles.root}>
        <Wrapper>
            <div className={styles.inner}>
                <Image className={styles.logo} src={basePath + '/images/logo.png'} width="300" height="100" alt="kraken logo" />
            </div>
        </Wrapper>
    </header>
};

export default Header;
