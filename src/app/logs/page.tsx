import styles from './page.module.css';
import dayjs from 'dayjs';

export default async function Logs() {
    const response = await fetch('http://localhost:3000/api/logs', { cache: 'no-store' });
    const data = await response.json();

    return (
        <div className={styles.page}>
            <table>
                <tbody>
                    <tr>
                        <th>Time</th>
                        <th>Sensor 0</th>
                        <th>Sensor 1</th>
                        <th>Sensor 2</th>
                        <th>Sensor 3</th>
                        <th>Sensor 4</th>
                        <th>Sensor 5</th>
                    </tr>
                </tbody>
                {data.response.map((v: {createdAt: string, sensors: number[]}, i: number) => (
                    <tbody key={i}>
                        <tr>
                            <td>{dayjs(v.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                            <td>{v.sensors[0]}%</td>
                            <td>{v.sensors[1]}%</td>
                            <td>{v.sensors[2]}%</td>
                            <td>{v.sensors[3]}%</td>
                            <td>{v.sensors[4]}%</td>
                            <td>{v.sensors[5]}%</td>
                        </tr>
                    </tbody>
                ))}
            </table>
        </div>
    )
}