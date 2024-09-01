'use client';

import React, {FC, useState, PropsWithChildren} from 'react';
import clsx from 'clsx';

import {Button} from "@/components/ui";
import CopyIcon from '/public/images/copy.svg';
import CompleteIcon from '/public/images/complete.svg';

import styles from './CopyButton.module.css';

interface CopyButtonProps extends PropsWithChildren {
    className?: string;
    copyContent: string;
}

const CopyButton: FC<CopyButtonProps> = ({className, copyContent, children}) => {
    const [isCopied, setIsCopied] = useState(false);

    const handlerClick = () => {
        navigator.clipboard.writeText(copyContent)
            .then(function () { setIsCopied(true) })
            .then(function () {
                setTimeout(() => {
                    setIsCopied(false);
                }, 3000)
            })
            .catch(function (err) { console.error('Failed to copy:', err); });
    };

    return <Button className={clsx(styles.root, className)} isLight={true} onClick={handlerClick} disabled={isCopied}>
        {isCopied ? 'Link has been copied' : children}
        {isCopied ? <CompleteIcon/> : <CopyIcon/>}
    </Button>
};

export default CopyButton;
