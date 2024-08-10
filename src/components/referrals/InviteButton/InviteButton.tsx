import React, {FC} from 'react';

import {Button} from "@/components/ui";

import styles from './InviteButton.module.css';

const InviteButton: FC = () => {
    return <Button className={styles.button} isLight={true}>Invite a friend</Button>
};

export default InviteButton;
