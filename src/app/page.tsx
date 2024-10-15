import styles from "./page.module.css";
import Sensors from "@/components/sensors/sensors";

export default async function Home() {
  const response = await fetch('http://localhost:3000/api/sensor', {
          cache: 'no-store'
      });
  
  const data = await response.json();

  return (
    <div className={styles.page}>
      <Sensors initialData={data.sensors}/>
    </div>
  );
}
