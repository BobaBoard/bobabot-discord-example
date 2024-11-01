import dotenv from "dotenv";
import { getRealmBoards, postUrlToBoard } from "./bobaboard";
import { Client, Events, GatewayIntentBits, Message } from "discord.js";

const POSTING_BOARD_ID = "4b30fb7c-2aca-4333-aa56-ae8623a92b65";
const DISCORD_CHANNEL_NAME = "bot";

dotenv.config();

// Uncommonent this API call to see what the IDs of the
// boards in your realm are.
// await getRealmBoards({ realmSlug: "twisted-minds" });

const extractUrl = (message: string) => {
  const urlPattern =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;
  // We get the first URL matched or null if nothing was matched
  return message.match(urlPattern)?.[0] ?? null;
};

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

  const messageUrl = extractUrl(message.content);
  if (!messageUrl) {
    console.log(`No URL found in ${message.content}`);
    return;
  }

  const postingResult = await postUrlToBoard({
    boardId: POSTING_BOARD_ID,
    url: messageUrl,
  });
  console.log(
    `Posted message in thread with id ${postingResult.id} in board !${postingResult.parent_board_slug}`
  );

  await message.react("✅");
});
