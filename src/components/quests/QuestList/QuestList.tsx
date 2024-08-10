import React, {FC} from 'react';

import styles from './QuestList.module.css';

const QuestList: FC = () => {
    return <div>
        <div className={styles.noQuests}>There are currently no quests available</div>
    </div>
};

export default QuestList;
