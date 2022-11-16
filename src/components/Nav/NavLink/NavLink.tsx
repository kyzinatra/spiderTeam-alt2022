import Link from "next/link";
import React, { FC, PropsWithChildren } from "react";
import { usePageMatch } from "../../../hooks/usePageMatch";
import { clx } from "../../../utils/clx";
import css from "./NavLink.module.css";

interface INavLink extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const NavLink: FC<PropsWithChildren<INavLink>> = ({ children, className, href, ...props }) => {
  const isMatch = usePageMatch(href || "/");
  if (isMatch) return null;
  return (
    <li>
      <Link href={href || "/"} className={clx(className, css.link)} {...props}>
        {children}
      </Link>
    </li>
  );
};
