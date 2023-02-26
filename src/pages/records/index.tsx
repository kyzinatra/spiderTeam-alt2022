import React, { useState } from "react";
import { Layout } from "../../components/Layout/Layout";
import { RecordsCard } from "../../components/Records/RecordsCard/RecordsCard";
import { RecordsNav } from "../../components/Records/RecordsNav/RecordsNav";
import { useEffectWithImports } from "../../hooks/useEffetchWithImports";
import { useAppDispatch, useAppSelector } from "../../services";
import { setRecords } from "../../services/slices/records";
import { TDBRecords, TRecords } from "../../types/records";

import css from "./records.module.css";

const Records = () => {
	const { records } = useAppSelector((s) => s.records);
	const dispatch = useAppDispatch();
	const [name, setName] = useState("");
	const [id, setId] = useState("");

	useEffectWithImports(
		([{ db }, { ref, onValue }]) => {
			onValue(ref(db, "maps"), (res) => {
				if (!res.exists()) return;

				const val = res.val() as TDBRecords;
				let data: TRecords[] = [];
				for (const value of Object.values(val)) {
					value.map = undefined;
					data.push(value);
				}
				dispatch(
					setRecords(
						data.sort((a, b) => {
							if (a.mapId !== b.mapId) {
								if (a.mapId < b.mapId) return 1;
								if (a.mapId > b.mapId) return -1;
								return 0;
							}
							if (a.stats.length !== b.stats.length) return a.stats.length - b.stats.length;
							if (a.stats.steps !== b.stats.steps) return a.stats.steps - b.stats.steps;
							if (a.stats.drops !== b.stats.drops) return a.stats.drops - b.stats.drops;
							return 0;
						})
					)
				);
			});
		},
		() => [import("../../../database.config"), import("firebase/database")],
		[]
	);

	return (
		<Layout title="Рекорды и Карты" onlyAuth>
			<header className={css.header}>
				<RecordsNav authorName={name} setAuthorName={setName} mapId={id} setMapId={setId} />
			</header>
			<main className={css.main}>
				{!records.length && <h1 className={css.main__loading}>Loading...</h1>}
				{records.map(
					({ mapId, stats: { length, drops, steps }, displayName, creator, recordId }) => {
						if (!creator.toLowerCase().includes(name) || !mapId.toLowerCase().includes(id)) return;
						return (
							<RecordsCard
								key={recordId}
								recordId={recordId}
								mapName={mapId.substring(0, 6)}
								length={length}
								drops={drops}
								steps={steps}
								displayName={displayName}
								creator={creator}
							/>
						);
					}
				)}
			</main>
		</Layout>
	);
};

export default Records;
