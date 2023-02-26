import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { CREATOR, LOCAL_CARDS, MAPID } from "../../../constants/card";
import { ImportAync } from "../../../hooks/useEffetchWithImports";
import { useToast } from "../../../hooks/useToast";
import { TDBRecord } from "../../../types/records";
import { Button } from "../../Form/Button/Button";
import css from "./RecordsCard.module.css";

interface IRecordsCard {
  displayName: string;
  creator: string;
  mapName: string;
  length: string | number;
  steps: string | number;
  drops: string | number;
  recordId: string;
}

export const RecordsCard: FC<IRecordsCard> = ({ displayName, creator, steps, length, drops, mapName, recordId }) => {
  const [isLoad, setLoad] = useState(false);
  const addToast = useToast();
  const router = useRouter();

  function PlayHandle() {
    setLoad(true);
    ImportAync([import("../../../../database.config"), import("firebase/database")], ([{ db }, { ref, get }]) => {
      get(ref(db, `maps/${recordId}`))
        .then(res => {
          if (!res.exists()) throw new Error("Не удалось получить результат");
          const val = res.val() as TDBRecord;
          let map = [...(val.map || [])];
          console.log(map?.length, 1);
          for (let i = 0; i < (map?.length || 0); i++) {
            map[i] = map[i] || [];
          }
          localStorage.setItem(LOCAL_CARDS, JSON.stringify(map?.map(a => a || [])));
          localStorage.setItem(CREATOR, val.creator);
          localStorage.setItem(MAPID, val.mapId);
          router.push("/");
        })
        .catch(e => addToast(e.message, "error"))
        .finally(() => setLoad(false));
    });
  }

  return (
    <div className={css.card}>
      <div className={css.card__info}>
        <p className={css.card__player}>Результат {displayName}!</p>
        <p>#{mapName.toUpperCase()}</p>
      </div>

      <div className={css.card__stats}>
        <p>Длина: {length}</p>
        <p>Шаги: {steps}</p>
        <p>Сбросы: {drops}</p>
        <p>
          Создатель: <span className={css.card__creator}>{creator}</span>
        </p>
      </div>
      <div className={css.card__btn}>
        <Button className={css.card__play} onClick={PlayHandle} disabled={isLoad}>
          Играть
        </Button>
      </div>
    </div>
  );
};
