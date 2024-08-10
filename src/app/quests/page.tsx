'use client';

import React, {FC} from 'react';

import {PageHeading} from "@/components/common";
import {Wrapper} from "@/components/layout";
import {QuestList} from "@/components/quests";
import {QuestsBar} from "@/components/quests";

import styles from './Quests.module.css';

const Quests: FC = () => {
    return (
        <div className={styles.root}>
            <PageHeading image="/images/quests-image.png" title="get more" titleAccent="diamonds"/>

            <Wrapper>
                <QuestList/>

                <QuestsBar/>
            </Wrapper>
        </div>
    );
}

export default Quests;
