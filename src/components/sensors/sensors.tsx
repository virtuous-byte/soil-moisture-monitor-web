'use client'

import styles from './sensors.module.css';
import Sensor from '../sensor/sensor';
import { useEffect, useState } from 'react';

type SensorData = number[];

interface SensorsProps {
    initialData: SensorData;
}

export default function Sensors({ initialData }: SensorsProps) {
    const [sensors, setSensors] = useState(initialData);
    const [check, setCheck] = useState(0);

    useEffect(() => {
        const id = setInterval(async () => {
                const response = await fetch('/api/sensor');
                const data = await response.json()
                if(data && Array.isArray(data.sensors)) {
                    setSensors(data.sensors);
                }
                setCheck(check + 1);
            }, 1000);
        return () => clearInterval(id);
    }, [check]);

    return (
        <div className={styles.sensors}>
            {sensors.map((v, i) => (
                <Sensor key={i} id={i + 1} value={v} />
            ))}
        </div>
    );
}