'use client';

import React, {FC} from 'react';
import clsx from 'clsx';
import {usePathname} from "next/navigation";

import {Wrapper} from "@/components/layout";
import {Button} from "@/components/ui";
import DiamondIcon from '/public/images/diamond.svg';
import ShipIcon from '/public/images/ship.svg';
import CaseIcon from '/public/images/case.svg';
import AnchorIcon from '/public/images/anchor.svg';

import styles from './Footre.module.css';

const Footer: FC = () => {
    const navigationItems = [
        {
            name: 'Game',
            link: '/',
            icon: <DiamondIcon/>,
        },
        {
            name: 'Referrals',
            link: '/referrals/',
            icon: <ShipIcon/>,
        },
        {
            name: 'Quests',
            link: '/quests/',
            icon: <CaseIcon/>,
        },
        {
            name: 'Leaderboard',
            link: '/leaderboard/',
            icon: <AnchorIcon/>,
        },
    ];

    const pathname = usePathname();

    return <footer className={styles.root}>
        <Wrapper>
            <div className={styles.inner}>
                <ul className={styles.navigation}>
                    {navigationItems && navigationItems.length && navigationItems.map((item) => (
                        <li key={item.name}>
                            <Button className={clsx(styles.button, pathname === item.link && styles.buttonActive)}
                                    href={pathname === item.link ? '' : item.link}>
                                {item.icon}
                                {item.name}
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </Wrapper>
    </footer>
};

export default Footer;
