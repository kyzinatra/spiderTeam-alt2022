import React from "react";
import { useAppSelector } from "../../services";
import { NavInfo } from "../Nav/NavInfo/NavInfo";

import css from "./Stats.module.css";

export const Stats = () => {
  const { length, drops, steps, entropy } = useAppSelector(s => s.cards.stats);
  return (
    <ul className={css.stats}>
      <li>
        <NavInfo content={entropy}>Беспорядки</NavInfo>
      </li>
      <li>
        <NavInfo content={length}>Длина</NavInfo>
      </li>
      <li>
        <NavInfo content={steps}>Шаги</NavInfo>
      </li>
      <li>
        <NavInfo content={drops}>Сбросы</NavInfo>
      </li>
    </ul>
  );
};
