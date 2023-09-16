import Image from "next/image";
import styles from "@/styles/page.module.sass";
import Link from "next/link";

export default function Home() {
  return (
    <main id={styles.main}>
      <h1>Linked</h1>
      <article className={styles.profileSection}>
        <h2>Descubre nustras redes sociales</h2>
        <div id={styles.socialMediaContent} className={styles.sectionContent}>
          <div>
            <Link href="/" target="_blank">
              <Image
                className={styles.experienceToolImage}
                src="/social-media/linkedin.svg"
                alt="Linkedin Icon"
                width="50"
                height="50"
              />
            </Link>
            <Link href="/" target="_blank">
              <Image
                className={styles.experienceToolImage}
                src="/social-media/youtube.svg"
                alt="Youtube Icon"
                width="50"
                height="50"
              />
            </Link>
            <Link href="/" target="_blank">
              <Image
                className={styles.experienceToolImage}
                src="/social-media/instagram.svg"
                alt="Instagram Icon"
                width="50"
                height="50"
              />
            </Link>
            <Link href="/" target="_blank">
              <Image
                className={styles.experienceToolImage}
                src="/social-media/tik-tok.svg"
                alt="TikTok Icon"
                width="50"
                height="50"
              />
            </Link>
            <Link href="/" target="_blank">
              <Image
                className={styles.experienceToolImage}
                src="/social-media/facebook.svg"
                alt="Facebook Icon"
                width="50"
                height="50"
              />
            </Link>
          </div>
        </div>
      </article>
      <article className={styles.profileSection}>
        <h2>Participa en nuestro sorteo</h2>
        <div id={styles.drawSection} className={styles.sectionContent}>
          <div></div>
          <div>
            <p>Acaba el 28/09, No te pierdas la oportunidad!</p>
            <Link href="/" target="_blank">
              <button>Participar</button>
            </Link>
          </div>
        </div>
      </article>
      <article className={styles.profileSection}>
        <h2>Conoce nuestra historia</h2>
        <div id={styles.historySection} className={styles.sectionContent}>
          <div></div>
          <div>
            <p>Lo que mas nos une como personas son las historias</p>
            <Link href="/" target="_blank">
              <button>Conoce la nuestra</button>
            </Link>
          </div>
        </div>
      </article>
      <article className={styles.profileSection}>
        <h2>Idoia x Enrique Tomas</h2>
        <div id={styles.partnershipSection} className={styles.sectionContent}>
          <div></div>
          <div>
            <p>Ademas de las historias, la comida tambien nos une.</p>
            <Link href="/" target="_blank">
              <button>Descrubre nuestro convenio con Enrique Tomas</button>
            </Link>
          </div>
        </div>
      </article>
      <article className={styles.profileSection}>
        <h2>Aprende de vino con nosotros</h2>
        <div id={styles.learnSection} className={styles.sectionContent}>
          <div></div>
          <div>
            <p>Participa de nuestras catas formativas!</p>
            <Link href="/" target="_blank">
              <button>Participar!</button>
            </Link>
          </div>
        </div>
      </article>
      <article className={styles.profileSection}>
        <h2>Contactanos</h2>
        <div id={styles.contactSection} className={styles.sectionContent}>
          <div>
            <form>
              <label>Nombre:</label>
              <input type="text" />
              <label>Empresa:</label>
              <input type="text" />
              <label>Mensaje:</label>
              <input type="text" />
              <button type="submit">Contactar</button>
            </form>
          </div>
        </div>
      </article>
    </main>
  );
}
