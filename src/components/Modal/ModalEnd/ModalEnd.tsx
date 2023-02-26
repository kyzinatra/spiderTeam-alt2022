import React, { useState } from "react";
import { CREATOR, LOCAL_CARDS, MAPID } from "../../../constants/card";
import { ImportAync } from "../../../hooks/useEffetchWithImports";
import { useToast } from "../../../hooks/useToast";
import { TSimpleResponse } from "../../../pages/api/maps/set";
import { useAppDispatch, useAppSelector } from "../../../services";
import { closeModal } from "../../../services/slices/cards";
import { TGrid } from "../../../types/card";
import { postFetch } from "../../../utils/fetchAPI";
import { Button } from "../../Form/Button/Button";
import css from "./ModalEnd.module.css";

export const ModalEnd = () => {
	const { stats, cards, snapshots } = useAppSelector((s) => s.cards);
	const isAuth = useAppSelector((s) => s.user.isAuth);
	const dispatch = useAppDispatch();
	const addToast = useToast();
	const [isLoading, setLoading] = useState(false);

	function publishHandler() {
		setLoading(true);
		ImportAync([import("../../../../firebase.config")], async ([{ auth }]) => {
			const token = await auth.currentUser?.getIdToken(true);
			const localCards = JSON.parse(localStorage.getItem(LOCAL_CARDS) || "[]") as TGrid;
			const creator = localStorage.getItem(CREATOR);
			const mapId = localStorage.getItem(MAPID);

			if (!cards?.every((cell) => !cell.length)) throw new Error("Карта не пройдена до конца.");
			if (!localCards.length)
				throw new Error(
					"Ошибка записи. Возможно вы проходили стандартную раскладку. Её нальзя опубликовать."
				);

			const res = await postFetch(
				"/api/maps/set",
				{
					stats,
					cards: localCards,
					snapshots,
					creator: creator || null,
					mapId,
				},
				token
			);

			const response = (await res.json()) as TSimpleResponse;
			addToast(response.message, response.success ? "success" : "error");
			if (response.success) dispatch(closeModal());
		})
			.catch((e) => addToast(e.message, "error"))
			.finally(() => setLoading(false));
	}

	return (
		<section className={css.article}>
			<h1 className={css.article__title}>Поздравляем!</h1>
			<h2 className={css.article__subtitle}>Вы прошли игру!</h2>
			<h3 className={css.article__stats}>Статистика:</h3>
			<ul className={css.article__list}>
				<li>Длина: {stats.length}</li>
				<li>Шаги: {stats.steps}</li>
				<li>Сбросы: {stats.drops}</li>
			</ul>
			{isAuth && (
				<Button
					styleType="button"
					className={css.article__button}
					onClick={publishHandler}
					disabled={isLoading}
				>
					Опубликовать
				</Button>
			)}
		</section>
	);
};
