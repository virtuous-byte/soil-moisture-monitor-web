import styles from './sensor.module.css';

export default function Sensor({id, value}: {
    id: number,
    value: number
}) {
    const calculateLevel = (value: number) => {
        if (value < 40) {
            return [`rgba(192, 0, 0, 0.75)`, 'Yetersiz'];
        } else if (value < 60) {
            return [`rgba(0, 192, 0, 0.75)`, 'Makul'];
        } else {
            return [`rgba(192, 192, 0, 0.75)`, 'Fazla'];
        }
    }

    const [backgroundColor, text] = calculateLevel(value);

    return (
        <div className={styles.sensor_root}>
            <div className={styles.sensor_bg}></div>
            <div className={styles.sensor_content_root}>
                <div className={styles.sensor_content_bg}></div>
                <div className={styles.sensor_content} style={{ backgroundColor: backgroundColor }}>
                    <p>Sensor ID: {id}</p>
                    <p>{value}%</p>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    );
}