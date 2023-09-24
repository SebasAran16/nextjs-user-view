import styles from "@/styles/page.module.sass";
import { ProfileLink } from "./components/profile-link";

export default function Home() {
  return (
    <main id={styles.main}>
      <h1>Linked</h1>
      <ProfileLink text={"Conoce nuestra ficha de cata"} url="/" />
      <ProfileLink text="" url="" />
      <ProfileLink text={"Conoce nuestra historia"} url="/" />
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
    </main>
  );
}
