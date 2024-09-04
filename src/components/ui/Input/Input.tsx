import React, {FC, InputHTMLAttributes} from 'react';
import clsx from 'clsx';

import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    ariaInvalid?: boolean;
    value?: string | number;
}

const Input: FC<InputProps> = ({
                                   className,
                                   value,
                                   ...props
                               }) => {

    return <input
        className={clsx(className, styles.root)}
        value={value}
        {...props}
    />
};

export default Input;
