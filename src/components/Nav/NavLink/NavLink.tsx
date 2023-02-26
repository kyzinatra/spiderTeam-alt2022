import Link from "next/link";
import React, { FC, PropsWithChildren } from "react";
import { usePageMatch } from "../../../hooks/usePageMatch";
import { clx } from "../../../utils/clx";

import css from "../../Form/Button/Button.module.css";

interface INavLink extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	shouldRender?: boolean;
}

export const NavLink: FC<PropsWithChildren<INavLink>> = ({
	children,
	className,
	href,
	shouldRender = true,
	...props
}) => {
	const isMatch = usePageMatch(href || "/");
	if (isMatch || !shouldRender) return null;

	return (
		<li>
			<Link href={href || "/"} className={clx(className, css.button)} {...props}>
				{children}
			</Link>
		</li>
	);
};
