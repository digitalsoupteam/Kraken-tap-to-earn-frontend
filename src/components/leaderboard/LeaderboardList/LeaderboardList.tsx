import React, {FC} from 'react';

import {Wrapper} from "@/components/layout";
import {UserItem} from "@/components/common";

import styles from './LeaderboardList.module.css';

const LeaderboardList: FC = () => {
    const mockUsers = [
        {
            id: 'user1',
            name: 'Jonny Smith',
            points: 200000000,
            image: '/images/user-image.png',
        },
        {
            id: 'user2',
            name: 'Jonny Smith',
            points: 100000000,
        },
        {
            id: 'user3',
            name: 'Jonny Smith',
            points: 50000000,
        },
        {
            id: 'user4',
            name: 'Jonny Smith',
            points: 40000000,
        },
        {
            id: 'user5',
            name: 'Jonny Smith',
            points: 30000000,
        },
        {
            id: 'user6',
            name: 'Jonny Smith',
            points: 20000000,
        },
        {
            id: 'user7',
            name: 'Jonny Smith',
            points: 10000000,
        },
        {
            id: 'user8',
            name: 'Jonny Smith',
            points: 5000000,
        },
        {
            id: 'user9',
            name: 'Jonny Smith',
            points: 4000000,
        },
        {
            id: 'user10',
            name: 'Jonny Smith',
            points: 300000,
        },
        {
            id: 'user11',
            name: 'Jonny Smith',
            points: 2500000,
        },
    ];

    return <section>
        <Wrapper>
            <div className={styles.list}>
                {mockUsers && mockUsers.length && mockUsers.map((user, index) => (
                    <UserItem placement={index + 1} key={user.id} image={user.image} name={user.name} points={user.points}/>
                ))}
            </div>
        </Wrapper>
    </section>
};

export default LeaderboardList;
