import admin from "firebase-admin";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { initializeApp } from "firebase/app";

const FIREBASE_CLIENT_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

let userAuthToken: string;
const getFirebaseAuthToken = async () => {
  if (userAuthToken) {
    // TODO: This needs logic for when the token is here but is expired
    return userAuthToken;
  }
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

  userAuthToken = await userCredentials.user.getIdToken(true);
  return userAuthToken;
};

export const postUrlToBoard = async (params: {
  boardId: string;
  url: string;
  // tags...
}) => {
  const postingResponse = await fetch(
    new URL(`/boards/${params.boardId}`, process.env.BOBABOARD_SERVER_URL),
    {
      method: "POST",
      headers: {
        Authorization: await getFirebaseAuthToken()!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: JSON.stringify([
          {
            insert: {
              "oembed-embed": {
                url: params.url,
              },
            },
          },
        ]),
        // whisperTags: ["This was posted in response to a Discord message"],
        // categoryTags: ["programming", "documentation"],
        // contentWarnings: ["programming jargon"],
      }),
    }
  );

  if (!postingResponse.ok) {
    throw new Error(`Posting failed with error ${postingResponse.status}`);
  }
  return await postingResponse.json();
};

export const getRealmBoards = async (params: { realmSlug: string }) => {
  const allBoardsResponse = await fetch(
    new URL(
      `/realms/slug/${params.realmSlug}`,
      process.env.BOBABOARD_SERVER_URL
    ),
    {
      headers: {
        Authorization: await getFirebaseAuthToken()!,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(await allBoardsResponse.json());
};
