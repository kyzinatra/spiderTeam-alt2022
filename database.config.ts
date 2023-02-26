import {
	AppCheck,
	ReCaptchaV3Provider,
	setTokenAutoRefreshEnabled,
	initializeAppCheck,
} from "firebase/app-check";
import { getDatabase } from "firebase/database";
import { app } from "./firebase.config";

let appCheck: AppCheck;
if (typeof document !== "undefined") {
	// @ts-ignore
	// self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

	appCheck = initializeAppCheck(app, {
		provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_CAPTHCA_KEY || ""),
		isTokenAutoRefreshEnabled: true,
	});
	setTokenAutoRefreshEnabled(appCheck, true);
}

export { appCheck };
export const db = getDatabase(app);
