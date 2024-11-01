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
const POSTING_BOARD_ID = "4b30fb7c-2aca-4333-aa56-ae8623a92b65";

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

// const allBoardsResponse = await fetch(
//   new URL(`/realms/slug/${REALM_NAME}`, process.env.BOBABOARD_SERVER_URL),
//   {
//     headers: {
//       Authorization: userToken,
//       "Content-Type": "application/json",
//     },
//   }
// );

const postingResponse = await fetch(
  new URL(`/boards/${POSTING_BOARD_ID}`, process.env.BOBABOARD_SERVER_URL),
  {
    method: "POST",
    headers: {
      Authorization: userToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: JSON.stringify([
        {
          insert: {
            "oembed-embed": {
              url: "https://nodejs.org/api/url.html",
            },
          },
        },
      ]),
      whisperTags: ["the NodeJS documentation is hard to parse sometimes"],
      categoryTags: ["programming", "documentation"],
      contentWarnings: ["programming jargon"],
    }),
  }
);

console.log(await postingResponse.json());
