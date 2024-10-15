import Image from "next/image"
import styles from './page.module.css';

export default async function Map() {
    const response = await fetch('http://localhost:3000/api/maps', { cache: 'no-store' });
    const data = await response.json();
    const imageSrc = `data:image/jpeg;base64,${data.image}`;

    return (
        <div className={styles.page}>
            <Image src={imageSrc} width={500} height={500} alt="" />
            <p>{data.time}</p>
        </div>
    )
}