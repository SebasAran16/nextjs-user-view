"use client";
import styles from "@/styles/components/views-box.module.sass";

interface ViewsBoxProps {
  views: any[];
}

export default function ViewsBox({ views }: ViewsBoxProps) {
  return (
    <section id={styles.viewContainer}>
      <div>
        <div id={styles.viewsSelectContainer}>
          {views
            ? views.length > 0
              ? views.map((view) => {
                  return <button>{view.name}</button>;
                })
              : "No views"
            : "Loading"}
        </div>
      </div>
      <div></div>
    </section>
  );
}
