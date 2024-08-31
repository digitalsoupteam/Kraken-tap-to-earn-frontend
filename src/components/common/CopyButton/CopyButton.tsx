'use client';

import React, {FC, PropsWithChildren} from 'react';
import clsx from 'clsx';

import CopyIcon from '/public/images/copy.svg';
import {Button} from "@/components/ui";

import styles from './CopyButton.module.css';

interface CopyButtonProps extends PropsWithChildren {
    className?: string;
    copyContent: string;
}

const CopyButton: FC<CopyButtonProps> = ({className, copyContent, children}) => {
    const handlerClick = () => {
        navigator.clipboard.writeText(copyContent)
            .then(function () { alert('copied: ' + copyContent); })
            .catch(function (err) { console.error('Failed to copy:', err); });
    };

    return <Button className={clsx(styles.root, className)} isLight={true} onClick={handlerClick}>
        {children}
        <CopyIcon/>
    </Button>
};

export default CopyButton;
