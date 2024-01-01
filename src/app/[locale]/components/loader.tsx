import styles from "@/styles/components/loader.module.sass";
import Image from "next/image";

export default function Loader() {
  return (
    <section id={styles.loaderModal}>
      <Image src="/icons/loader.gif" alt="Loader" width="65" height="65" />
    </section>
  );
}
