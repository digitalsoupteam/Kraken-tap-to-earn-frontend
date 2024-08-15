import React, {FC} from 'react';

import styles from './QuestList.module.css';
import {QuestItem} from "@/components/quests";

const QuestList: FC = () => {
    const questList = [
        {
            id: 'quest0',
            name: 'Subscribe to our youtube',
            points: 20000,
            objective: 'youtube',
            link: '#',
            status: 'not-started',
        },
        {
            id: 'quest1',
            name: 'Subscribe to our youtube',
            points: 20000,
            objective: 'telegram',
            link: '#',
            status: 'not-started',
        },
        {
            id: 'quest2',
            name: 'Subscribe to our youtube',
            points: 20000,
            objective: 'youtube',
            link: '#',
            status: 'complete',
        },
        {
            id: 'quest3',
            name: 'Subscribe to our youtube',
            points: 20000,
            objective: 'telegram',
            link: '#',
            status: 'complete',
        },
    ];

    return <div className={styles.root}>
        {questList && questList.length && questList.map(quest => (
            <QuestItem name={quest.name} points={quest.points} href={quest.link} objective={quest.objective} status={quest.status}
                       key={quest.id}/>
        ))}

        {!questList && <div className={styles.noQuests}>There are currently no quests available</div>}
    </div>
};

export default QuestList;
