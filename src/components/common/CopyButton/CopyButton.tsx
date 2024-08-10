'use client';

import React, {FC} from 'react';

import CopyIcon from '/public/images/copy.svg';
import {Button} from "@/components/ui";

import styles from './CopyButton.module.css';

interface CopyButtonProps {
    copyContent: string;
}

const CopyButton: FC<CopyButtonProps> = ({copyContent}) => {
    const handlerClick = () => {
        navigator.clipboard.writeText(copyContent)
            .then(function () { alert('copied: ' + copyContent); })
            .catch(function (err) { console.error('Failed to copy:', err); });
    };

    return <Button className={styles.root} isLight={true} onClick={handlerClick}>
        <CopyIcon/>
    </Button>
};

export default CopyButton;
