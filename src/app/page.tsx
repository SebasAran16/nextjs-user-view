import Link from "next/link";
import styles from "@/styles/home.module.sass";
import ElementsBox from "./components/elementsBox";

export default async function Home() {
  return (
    <main>
      <header id={styles.header}>
        <h1>Welcome to CustomerView!</h1>
        <section id={styles.headerButtons}>
          <Link href="/login">
            <button>Login</button>
          </Link>
          <Link href="/signup">
            <button>Signup</button>
          </Link>
        </section>
      </header>
    </main>
  );
}
