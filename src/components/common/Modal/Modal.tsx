'use client';

import React, {FC, PropsWithChildren, useRef} from 'react';
import clsx from 'clsx';

import styles from './Modal.module.css';

interface ModalProps extends PropsWithChildren {
    isOpen: boolean;
    closeModal: () => void;
}

const Modal: FC<ModalProps> = ({isOpen, closeModal, children}) => {
    const innerRef = useRef<HTMLDivElement>(null);

    const handleOutsideClick = (evt: React.MouseEvent) => {
        if (innerRef.current && !innerRef.current.contains(evt.target as Node)) {
            closeModal();
        }
    };

    return <div className={clsx(styles.root, isOpen && styles.opened)} onClick={handleOutsideClick}>
        <div className={styles.inner} ref={innerRef}>
            {children}
        </div>
    </div>
};

export default Modal;
