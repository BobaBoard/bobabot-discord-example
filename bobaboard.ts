import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";

const FIREBASE_CLIENT_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

let userAuthToken: string;
const getFirebaseAuthToken = async (
  {
    forceRefresh,
  }: {
    forceRefresh: boolean;
  } = { forceRefresh: false }
) => {
  if (userAuthToken && !forceRefresh) {
    return userAuthToken;
  }
  const firebaseClientApp = initializeApp(FIREBASE_CLIENT_CONFIG);
  const firebaseClientAuth = getAuth(firebaseClientApp);

  const userCredentials = await signInWithEmailAndPassword(
    firebaseClientAuth,
    process.env.USER_EMAIL!,
    process.env.USER_PASSWORD!
  );

  userAuthToken = await userCredentials.user.getIdToken(true);
  return userAuthToken;
};

const fetchWithAuthRetry = async (...params: Parameters<typeof fetch>) => {
  const response = await fetch(...params);

  if (!response.ok) {
    const [url, init] = params;
    if (response.status == 401) {
      // Refresh authentication and retry
      console.log("Refreshing authentication");
      return fetchWithAuthRetry(url, {
        ...init,
        headers: {
          ...(init?.headers ?? {}),
          Authorization: await getFirebaseAuthToken({ forceRefresh: true })!,
        },
      });
    }
    throw new Error(`Posting failed with error ${response.status}`);
  }
  return response;
};

export const postUrlToBoard = async (params: {
  boardId: string;
  url: string;
  // tags...
}) => {
  const postingResponse = await fetchWithAuthRetry(
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
  const allBoardsResponse = await fetchWithAuthRetry(
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
