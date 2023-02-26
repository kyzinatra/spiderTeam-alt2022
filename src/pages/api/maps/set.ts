import { database } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { app } from "../../../../admin.config";
import { IStats } from "../../../services/slices/cards";
import { TGrid } from "../../../types/card";
import { OriginTest } from "../../../utils/originTest";
export type TSimpleResponse = { success: boolean; message: string };

type TSetBody = {
	cards: TGrid;
	snapshots: TGrid[];
	stats: IStats;
	creator: string | null;
	mapId: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<TSimpleResponse>) {
	if (req.method !== "POST" || !OriginTest.test(req.headers.origin || "")) {
		res.status(403).json({ message: "Incorrect method or origin!", success: false });
		return;
	}

	try {
		const token = req.headers.authorization || "";
		const { cards, stats, snapshots, creator, mapId } = req.body as TSetBody;

		if ((snapshots as TGrid[]).length !== stats.steps)
			throw new Error("Ошибка безопасности при проверке карт");

		const auth = getAuth(app);
		const db = database();
		const claims = await auth.verifyIdToken(token);
		const user = await auth.getUser(claims.uid);

		if (!user.displayName)
			throw Error("Для прохождения карт поля имя, в профиле, должно быть заполнено");

		if (user.uid) {
			const ID = uuid();
			await db
				.ref("/maps/" + ID)
				.set({
					userId: user.uid,
					userEmail: user.email,
					displayName: user.displayName,
					map: cards,
					stats,
					mapId: mapId || uuid(),
					recordId: ID,
					creator: creator || user.displayName,
				})
				.then(() => {
					console.log("success!");
					res.status(200).json({ success: true, message: "Карта успешно добавлена!" });
				})
				.catch((e) => {
					console.log(e);
					res.status(400).json({ success: false, message: "Что-то пошло не так..." });
				});
		} else {
			res.status(400).json({ success: false, message: "Что-то пошло не так..." });
		}
	} catch (e) {
		res
			.status(400)
			.json({ success: false, message: (e as Error).message || "Что-то пошло не так..." });
	}
}
