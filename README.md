# bobabot-discord-example

An example of building a Discord Bot that publishes URLs sent to a channel
as a new thread in a board.

This is a very barebone example that is missing some features that would be
necessary for real-world usage, but should give people an idea of how to
interact with the BobaBoard API.

To use this, you'll need to independently configure a BobaBoard instance (including
firebase authentication) and a Discord bot.

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
