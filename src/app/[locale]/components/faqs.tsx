"use client";
import styles from "@/styles/components/faqs.module.sass";
import Image from "next/image";

export default function FAQs() {
  function handleFaqClick(e: React.MouseEvent<HTMLDivElement>) {
    const faq = e.currentTarget;
    const faqAnswer = faq.lastElementChild;

    if (faq.classList.contains(styles.faqOpened)) {
      faqAnswer!.classList.remove(styles.faqAnswerShown);
      faq.classList.remove(styles.faqOpened);
    } else {
      faqAnswer!.classList.add(styles.faqAnswerShown);
      faq.classList.add(styles.faqOpened);
    }
  }

  return (
    <main id={styles.faqsContainer}>
      <article id={styles.formFaqs}>
        <div className={styles.faq} onClick={handleFaqClick}>
          <div>
            <p>Como cambio la foto/video/link de mi elemento?</p>
            <Image
              src="/icons/arrow-down-main-color.svg"
              alt="Arrow Down Icon"
              height="24"
              width="24"
            />
          </div>
          <article className={styles.faqAnswer}>
            <p>Aca lo puedes ver</p>
          </article>
        </div>
        <div className={styles.faq} onClick={handleFaqClick}>
          <div>
            <p>Como modifico los colores de mi elemento?</p>
            <Image
              src="/icons/arrow-down-main-color.svg"
              alt="Arrow Down Icon"
              height="24"
              width="24"
            />
          </div>
          <article className={styles.faqAnswer}>
            <p>Aca lo puedes ver:</p>
          </article>
        </div>
      </article>
      <article id={styles.formFaqs}>
        <div className={styles.faq} onClick={handleFaqClick}>
          <div>
            <p>Como cancelo mi subscripcion?</p>
            <Image
              src="/icons/arrow-down-main-color.svg"
              alt="Arrow Down Icon"
              height="24"
              width="24"
            />
          </div>
          <article className={styles.faqAnswer}>
            <p>Aca lo puedes ver:</p>
          </article>
        </div>
        <div className={styles.faq} onClick={handleFaqClick}>
          <div>
            <p>Mentoria con el equipo</p>
            <Image
              src="/icons/arrow-down-main-color.svg"
              alt="Arrow Down Icon"
              height="24"
              width="24"
            />
          </div>
          <article className={styles.faqAnswer}>
            <p>Aca lo tienes:</p>
          </article>
        </div>
      </article>
    </main>
  );
}
