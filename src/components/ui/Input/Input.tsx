import React, {FC, InputHTMLAttributes} from 'react';
import clsx from 'clsx';

import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    value?: string | number;
    isInvalid?: boolean;
}

const Input: FC<InputProps> = ({
                                   className,
                                   value,
                                   isInvalid,
                                   ...props
                               }) => {

    return <input
        className={clsx(className, styles.root, isInvalid && styles.invalid)}
        value={value}
        {...props}
    />
};

export default Input;
