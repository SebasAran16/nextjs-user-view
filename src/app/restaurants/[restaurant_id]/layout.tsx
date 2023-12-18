import styles from "@/styles/layouts/view-layout.module.sass";

interface RestaurantManagerLayoutInterface {
  children: React.ReactNode;
}

export default function ViewLayout({
  children,
}: RestaurantManagerLayoutInterface) {
  return (
    <main>
      <section id={styles.viewElements}>{children}</section>
      <footer id={styles.footer}>
        <p>
          Made with love by: <br /> <a>BIG BANG SERVICES</a>
        </p>
      </footer>
    </main>
  );
}
