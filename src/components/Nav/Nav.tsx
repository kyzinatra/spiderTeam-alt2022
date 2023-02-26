import React, { FC } from "react";
import { clx } from "../../utils/clx";
import { NavLink } from "./NavLink/NavLink";
import Image from "next/image";

import css from "./Nav.module.css";

import { useAppDispatch, useAppSelector } from "../../services";
import { restoreSnapshot } from "../../services/slices/cards";
import { NavButton } from "./NavButton/NavButton";
import { ICON_SIZE } from "../../constants/image";

export const Nav: FC = () => {
	const dispacth = useAppDispatch();
	const isAuth = useAppSelector((s) => s.user.isAuth);

	return (
		<nav className={clx(css.nav)}>
			<ul className={clx(css.nav__list)}>
				<NavLink href="/rules" title="Правила">
					<Image src="/book.svg" width={ICON_SIZE} height={ICON_SIZE} alt="Правила" />
				</NavLink>
				<NavLink href="/" title="Главная страница">
					<Image src="/game.svg" width={ICON_SIZE} height={ICON_SIZE} alt="Игра" />
				</NavLink>
				<NavLink href="/constructor" shouldRender={isAuth} title="Конструктор">
					<Image src="/build.svg" width={ICON_SIZE} height={ICON_SIZE} alt="Конструктор" />
				</NavLink>
				<NavLink href="/records" shouldRender={isAuth} title="Рекорды">
					<Image src="/stars.svg" width={ICON_SIZE} height={ICON_SIZE} alt="Рекорды" />
				</NavLink>
				<NavLink href={isAuth ? "/profile" : "/login"} title="Профиль">
					<Image src="/profile.svg" width={ICON_SIZE} height={ICON_SIZE} alt="Профиль" />
				</NavLink>
				<NavButton onClick={() => dispacth(restoreSnapshot())} title="Отменить действие">
					<Image src="/back.svg" width={ICON_SIZE} height={ICON_SIZE} alt="Отменить действие" />
				</NavButton>
			</ul>
		</nav>
	);
};
