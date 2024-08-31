import React, { FC } from 'react';

import { QuestItem } from "@/components/quests";

import styles from './QuestList.module.css';

interface IQuestItem {
    id: number;
    name: string;
    points: number;
    objective: string;
    link: string;
    status: 'completed' | 'failed' | 'not-started' | 'verifying';
}

const QuestList: FC = () => {
    // const questList = [
    //     {
    //         id: 'quest0',
    //         name: 'Subscribe to our youtube',
    //         points: 20000,
    //         objective: 'youtube',
    //         link: '#',
    //         status: 'not-started',
    //     },
    //     {
    //         id: 'quest1',
    //         name: 'Subscribe to our youtube',
    //         points: 20000,
    //         objective: 'telegram',
    //         link: '#',
    //         status: 'not-started',
    //     },
    //     {
    //         id: 'quest2',
    //         name: 'Subscribe to our youtube',
    //         points: 20000,
    //         objective: 'youtube',
    //         link: '#',
    //         status: 'completed',
    //     },
    //     {
    //         id: 'quest3',
    //         name: 'Subscribe to our youtube',
    //         points: 20000,
    //         objective: 'telegram',
    //         link: '#',
    //         status: 'completed',
    //     },
    // ];

    const questList: IQuestItem[] = [];

    return (
        <div className={styles.root}>
            {questList.length > 0 ? (
                questList.map(quest => (
                    <QuestItem
                        name={quest.name}
                        points={quest.points}
                        href={quest.link}
                        objective={quest.objective}
                        status={quest.status}
                        key={quest.id}
                    />
                ))
            ) : (
                <div className={styles.noQuests}>There are currently no quests available</div>
            )}
        </div>
    );
};

export default QuestList;
