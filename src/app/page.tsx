import styles from "@/styles/page.module.sass";
import { ProfileLink } from "./components/profile-link";
import Image from "next/image";
import { VideoPlayer } from "./components/video-player";

export default async function Home() {
  return (
    <main id={styles.main}>
      <Image
        id={styles.logo}
        src="/logo.png"
        alt="Logo Image"
        width="200"
        height="200"
      />
      <VideoPlayer
        text={"Conoce nuestra ficha de cata"}
        url="/videos/ficha-cata.mp4"
        id={0}
      />
      <ProfileLink text="" url="" />
      <VideoPlayer
        text={"Conoce nuestra historia"}
        url="/videos/historia.mp4"
        id={1}
      />
      <ProfileLink text={"IDOIA X AMÉLIE"} url="/" />
      <article className={styles.groupedLinks}>
        <ProfileLink
          text={"Productos"}
          url="https://www.vilaviniteca.es/es/catalogsearch/result/?q=CA+N%E2%80%99ESTRUC "
        />
        <ProfileLink text={"Sorteos"} url="/" />
      </article>
      <ProfileLink
        text={"Vive la experiencia vinicola con nosotros"}
        url="https://www.vilaviniteca.es/es/catas-y-eventos.html?product_list_dir=asc"
      />
      <ProfileLink
        text={"16º Premio Vila Viniteca de Cata por Parejas"}
        url="https://www.vilaviniteca.es/es/blog/14o-premio-vila-viniteca-de-cata-por-parejas/
        "
      />
      <div id={styles.footer}>
        <p>
          Made with love by: <br /> <a>BIG BANG SERVICES</a>
        </p>
      </div>
    </main>
  );
}
