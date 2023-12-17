import styles from "@/styles/dashboard.module.sass";
import React from "react";
import { toast } from "react-hot-toast";
import ElementsBox from "../components/elementsBox";
import ViewsBox from "../components/viewsBox";
import { RestaurantsBox } from "../components/restaurantsBox";

export default function Dashboard() {
  return (
    <section>
      <div>
        <RestaurantsBox />
        {/* <ViewsBox /> */}
      </div>
    </section>
  );
}
