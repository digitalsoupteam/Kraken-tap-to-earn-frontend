import React, {FC, ButtonHTMLAttributes} from 'react';
import Link from 'next/link';

import clsx from 'clsx';

import styles from './Button.module.css';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    href?: string;
    target?: string;
    disabled?: boolean;
    onClick?: () => void;
    isLight?: boolean;
}

const Button: FC<IButtonProps> = ({className, onClick, children, href, target, type, disabled, isLight}) => (
    href ? (
        <Link
            className={clsx(className, styles.root, isLight && styles.light)}
            onClick={onClick}
            href={href}
            target={target}
        >
            {children}
        </Link>
    ) : (
        <button
            className={clsx(className, styles.root, isLight && styles.light)}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    )
);

export default Button;
