import React, {FC} from 'react';

import {Button} from "@/components/ui";
import {CopyButton} from '@/components/common'

import styles from './InviteButton.module.css';

const InviteButton: FC = () => {
    return <CopyButton className={styles.button} copyContent={'ref link'}>Invite a friend</CopyButton>
};

export default InviteButton;
