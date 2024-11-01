import dotenv from "dotenv";
import admin from "firebase-admin";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Client, Events, GatewayIntentBits, Message } from "discord.js";

dotenv.config();

const REALM_NAME = "twisted-minds";
const POSTING_BOARD_ID = "4b30fb7c-2aca-4333-aa56-ae8623a92b65";
const DISCORD_CHANNEL_NAME = "bot";

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

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.login(process.env.DISCORD_TOKEN);

client.once(Events.ClientReady, () => {
  console.log("I'm ready!");
});

client.on(Events.MessageCreate, async (message) => {
  if (
    message.author.bot ||
    !("name" in message.channel) ||
    message.channel.name !== DISCORD_CHANNEL_NAME
  ) {
    return;
  }

  console.log(`Received message: ${message.content}`);

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
        whisperTags: ["This was posted in response to a Discord message"],
        categoryTags: ["programming", "documentation"],
        contentWarnings: ["programming jargon"],
      }),
    }
  );

  console.log(await postingResponse.json());
});

// const allBoardsResponse = await fetch(
//   new URL(`/realms/slug/${REALM_NAME}`, process.env.BOBABOARD_SERVER_URL),
//   {
//     headers: {
//       Authorization: userToken,
//       "Content-Type": "application/json",
//     },
//   }
// );
