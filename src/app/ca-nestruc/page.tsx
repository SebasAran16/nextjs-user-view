import styles from "@/styles/page.module.sass";
import { ProfileLink } from "../components/views/profile-link";
import Image from "next/image";
import { VideoPlayer } from "../components/views/video-player";
import { useState } from "react";
import { ModalImage } from "../components/views/modal-image";
import { LinkGroup } from "../components/views/link-group";
import { getColorFromUse } from "@/utils/returnUseColor";
import { ColorUse } from "@/types/structs/colorUse";

export default async function CaNEstruc() {
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
        mainColor={getColorFromUse(ColorUse.MAIN)}
        secondaryColor={getColorFromUse(ColorUse.SECONDARY)}
        textColor={getColorFromUse(ColorUse.TEXT)}
      />
      <LinkGroup />
      <VideoPlayer
        text={"Conoce nuestra historia"}
        url="/videos/historia.mp4"
        mainColor={getColorFromUse(ColorUse.MAIN)}
        secondaryColor={getColorFromUse(ColorUse.SECONDARY)}
        textColor={getColorFromUse(ColorUse.TEXT)}
      />
      <ProfileLink
        text={"IDOIA X AMÉLIE"}
        url="/"
        mainColor={getColorFromUse(ColorUse.MAIN)}
        secondaryColor={getColorFromUse(ColorUse.SECONDARY)}
        textColor={getColorFromUse(ColorUse.TEXT)}
      />
      <article className={styles.groupedLinks}>
        <ProfileLink
          text={"Productos"}
          url="https://www.vilaviniteca.es/es/catalogsearch/result/?q=CA+N%E2%80%99ESTRUC"
          mainColor={getColorFromUse(ColorUse.MAIN)}
          secondaryColor={getColorFromUse(ColorUse.SECONDARY)}
          textColor={getColorFromUse(ColorUse.TEXT)}
        />
        <ModalImage
          text="Sorteos"
          url="/sorteo.jpeg"
          mainColor={getColorFromUse(ColorUse.MAIN)}
          secondaryColor={getColorFromUse(ColorUse.SECONDARY)}
          textColor={getColorFromUse(ColorUse.TEXT)}
        />
      </article>
      <ProfileLink
        text={"Vive la experiencia vinicola con nosotros"}
        url="https://www.vilaviniteca.es/es/catas-y-eventos.html?product_list_dir=asc"
        mainColor={getColorFromUse(ColorUse.MAIN)}
        secondaryColor={getColorFromUse(ColorUse.SECONDARY)}
        textColor={getColorFromUse(ColorUse.TEXT)}
      />
      <ProfileLink
        text={"16º Premio Vila Viniteca de Cata por Parejas"}
        url="https://www.vilaviniteca.es/es/blog/14o-premio-vila-viniteca-de-cata-por-parejas/"
        mainColor={getColorFromUse(ColorUse.MAIN)}
        secondaryColor={getColorFromUse(ColorUse.SECONDARY)}
        textColor={getColorFromUse(ColorUse.TEXT)}
      />
      <footer id={styles.footer}>
        <p>
          Made with love by: <br /> <a>BIG BANG SERVICES</a>
        </p>
      </footer>
    </main>
  );
}
