import styles from "@/styles/dashboard.module.sass";
import React from "react";
import { toast } from "react-hot-toast";
import ElementsBox from "../components/elementsBox";
import ViewsBox from "../components/viewsBox";

export default function Dashboard() {
  return (
    <section>
      <div>
        <h2>These are your current active views:</h2>
        <ViewsBox />
      </div>
    </section>
  );
}
