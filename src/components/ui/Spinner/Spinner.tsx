import React, {FC} from 'react';
import Image from "next/image";
import clsx from "clsx";

import styles from './Spinner.module.css';

interface SpinnerProps {
    className?: string;
}

const Spinner: FC<SpinnerProps> = ({className}) => {
    return <Image className={clsx(className, styles.root)} src={"/images/spinner.png"} width={"110"} height={"110"}
           alt={"loading"}/>
};

export default Spinner;
