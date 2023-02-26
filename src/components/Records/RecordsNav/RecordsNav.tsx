import React, { Dispatch, FC, PropsWithChildren, useState } from "react";
import { Input } from "../../Form/Input/Input";

import Image from "next/image";
import { ICON_SIZE } from "../../../constants/image";
import { NavLink } from "../../Nav/NavLink/NavLink";

import css from "./RecordsNav.module.css";

interface IRecordsNav {
	authorName: string;
	setAuthorName: Dispatch<React.SetStateAction<string>>;
	mapId: string;
	setMapId: Dispatch<React.SetStateAction<string>>;
}

export const RecordsNav: FC<PropsWithChildren<IRecordsNav>> = ({
	authorName,
	setAuthorName,
	mapId,
	setMapId,
}) => {
	return (
		<nav className={css.nav}>
			<ul className={css.nav__list}>
				<NavLink href="/">
					<Image src="/back.svg" width={ICON_SIZE} height={ICON_SIZE} alt="На главную" />
				</NavLink>
				<NavLink href="profile">
					<Image src="/profile.svg" width={ICON_SIZE} height={ICON_SIZE} alt="Профиль" />
				</NavLink>
				<NavLink href="/">
					<Image src="/game.svg" width={ICON_SIZE} height={ICON_SIZE} alt="Играть" />
				</NavLink>
				<li className={css.nav__inputs}>
					<Input
						placeholder="Имя автора"
						value={authorName}
						onChange={(e) => setAuthorName(e.target.value.toLowerCase())}
					/>
					<Input
						placeholder="ID результата"
						value={mapId}
						onChange={(e) => setMapId(e.target.value.toLowerCase())}
					/>
				</li>
			</ul>
		</nav>
	);
};
