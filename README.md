# bobabot-discord-example

An example of building a Discord Bot that publishes URLs sent to a channel
as a new thread in a board.

This is a very barebone example that is missing some features that would be
necessary for real-world usage, but should give people an idea of how to
interact with the BobaBoard API.

To use this, you'll need to independently configure a BobaBoard instance (including
firebase authentication) and a Discord bot.

## Creating `.env` file for configuration

> [!WARNING]
> If you forget to create this file or add any of the variables
> below, there may be weird behavior, but the bot won't tell you that it's
> because you forgot these and which ones you forgot.
>
> If you want to help us improve this example, for example by fixing this,
> contact us here or at contacts@fujocoded.com!

To use this you must first create a `.env` file in the top level directory.
This is the data you need in your file:

```bash
# The URL of your BobaBoard SERVER (not client). This can stay localhost
# if you're testing on your own machine.
BOBABOARD_SERVER_URL=http://localhost:4200/
# The ID of the board you want to post on. This one corresponds to the
# !anime board in the twisted-realm sample realm.
POSTING_BOARD_ID=4b30fb7c-2aca-4333-aa56-ae8623a92b65
# The bot only listens to messages in channels that have this name.
DISCORD_CHANNEL_NAME=bot
# When you run BobaBoard you'll need a firebase account for authentication.
# Put its CLIENT key here.
FIREBASE_API_KEY=THIS_IS_A_SECRET_YOU_MUST_FIGURE_OUT_ON_YOUR_OWN
# This will need to be changed but the shape is similar
FIREBASE_AUTH_DOMAIN=bobaboard-fb.firebaseapp.com
# This will need to be changed but the shape is similar
FIREBASE_PROJECT_ID=bobaboard-fb
# You must create your user via firebase and give it a password
USER_EMAIL=contacts@fujocoded.com
USER_PASSWORD=THIS_IS_A_SECRET_YOU_MUST_FIGURE_OUT_ON_YOUR_OWN_TOO
#You must create a Discord both on your own
DISCORD_TOKEN=THIS_IS_A_SECRET_YOU_MUST_FIGURE_OUT_ON_YOUR_OWN_THREE
```

## Installing

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.29. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
