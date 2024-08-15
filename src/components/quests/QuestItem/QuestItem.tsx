import React, {FC} from 'react';
import clsx from 'clsx';
import Image from 'next/image';


import {Button} from "@/components/ui";
import {Points} from "@/components/common";
import TickIcon from '/public/images/tick.svg';
import CompleteIcon from '/public/images/complete.svg';

import styles from './QuestItem.module.css';

interface QuestItemProps {
    name: string;
    objective: string;
    href: string;
    points: number;
    status: string;
}

const QuestItem: FC<QuestItemProps> = ({name, objective, href, points, status}) => {

    return <Button className={clsx(styles.root, styles.link)} href={href} target={"_blank"}>
        <span>
            <Image className={styles.objectiveIcon} src={`/images/quest-${objective}.svg`} width="40" height="40" alt="" />
        </span>

        <span className={styles.info}>
            <span className={styles.name}>{name}</span>
            <span className={styles.reward}>+ <Points points={points}/></span>
        </span>

        <span>
            {status === 'not-started' && <TickIcon className={styles.statusIcon} />}
            {status === 'complete' && <CompleteIcon className={styles.statusIcon} />}
        </span>
    </Button>
};

export default QuestItem;
