import dotenv from "dotenv";
import admin from "firebase-admin";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { initializeApp } from "firebase/app";

dotenv.config();

const REALM_NAME = "twisted-minds";
const FIREBASE_CLIENT_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const firebaseAdminApp = admin.initializeApp({
  credential: admin.credential.cert("./service-account-key.json"),
});
const firebaseClientApp = initializeApp(FIREBASE_CLIENT_CONFIG);
const firebaseClientAuth = getAuth(firebaseClientApp);

const userRecord = await firebaseAdminApp
  .auth()
  .getUserByEmail("contacts@fujocoded.com");
const customToken = await firebaseAdminApp
  .auth()
  .createCustomToken(userRecord.uid);
const userCredentials = await signInWithCustomToken(
  firebaseClientAuth,
  customToken
);
const userToken = await userCredentials.user.getIdToken(true);

const allBoardsResponse = await fetch(
  new URL(`/realms/slug/${REALM_NAME}`, process.env.BOBABOARD_SERVER_URL),
  {
    headers: {
      Authorization: userToken,
      "Content-Type": "application/json",
    },
  }
);

console.log(await allBoardsResponse.json());
