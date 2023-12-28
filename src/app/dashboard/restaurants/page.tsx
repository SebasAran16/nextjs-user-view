import styles from "@/styles/dashboard.module.sass";
import React from "react";
import { toast } from "react-hot-toast";
import { RestaurantsBox } from "../../components/restaurantsBox";

export default function Dashboard() {
  return (
    <section>
      <div>
        <RestaurantsBox />
      </div>
    </section>
  );
}
