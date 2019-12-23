# K33NBot
A simple Discord bot for displaying game server status.

## Installation
1. Create at least one bot in the Discord developer portal.
2. Clone this repository.
3. Copy `config-example.json` to `~/k33nbot.json`
4. Customize `k33nbot.json`
5. `node index.js`

## Configuration
K33NBot has a flexible configuration. An instance of K33NBot can consist of one or many bots. Each bot can have one or many actions. Actions have a command associated with them, as well as a plugin, which defines what the action does.

Use the included `config-example.json` as an example of proper syntax to base your configuration from.

### General configuration
- **debug** - `true` or `false`. Controls the amount of console output.

### Bot configuration
- **type** - Specifies the behavior of the bot. Current options are `discordClient` and `discordWebhook`.
- **options** - An array of options that are specific to the bot type defined.
- **actions** - An array of actions for the bot, detailed in the next section.

### Bot type-specific options
Each bot type may have options that can be used to customize its behavior. Some options may be required, while others are optional.

#### discordClient
- **actionPrefix** - Messages beginning with this prefix, followed by an action command, will be executed by this bot.
- **defaultPresence** - If present, always adds this string to the bot's presence text.
- **token** - The Discord API token to use for the bot.

#### discordWebhook
- **webhookUrl** - The webhook URL.

### Action configuration
- **plugin** - Specifies the behavior of the action. Current options are `battlemetrics`, `fivem`, `mcserverstatus`, `message`, and `timer`.
- **command** - Messages beginning with the bot's `actionPrefix`, followed by this command, will execute this action.
- **options** - An array of options that are specific to the plugin defined.

### Plugin-specific options
Each action plugin may have options that can be used to customize its behavior. Some options may be required, while others are optional.

#### admin
Allows manipulation of configuration JSON.

- **allowedRole** - Users in this role can use this plugin.

#### battlemetrics
The `battlemetrics` plugin is currently only supported for Rust servers.

- **name** - Name to show for the server in the bot's presence.
- **thumbnail** - URL of thumbnail to show in the reply embed.
- **image** - URL of image banner to show in the reply embed.
- **serverId** - Battlemetrics ID for the server.

#### fivem and fivem2
- **name** - Name to show for the server in the bot's presence.
- **thumbnail** - URL of thumbnail to show in the reply embed.
- **image** - URL of image banner to show in the reply embed.
- **server** - IP:port of the FiveM server.

#### greeter
Send a message to a specific channel whenever a new person joins the server.

- **channel** - Name of channel to send the message to.

#### mcserverstatus
- **name** - Name to show for the server in the bot's presence.
- **thumbnail** - URL of thumbnail to show in the reply embed.
- **image** - URL of image banner to show in the reply embed.
- **server** - IP:port of the Minecraft server.

#### message
Reply to a command with a message.

- **message** - Message to reply with.
- **presence** - Text to append to the bot's presence.
- **useEmbed** - If true, sends the message using embed formatting.

#### timer
Send a message to a specific channel at the specified interval.

- **channel** - Name of channel to send the message to.
- **interval** - Number of seconds between sending the message.
- **message** - The message to send.

## Need help?
Sorry! This bot comes as-is, without support.



© 2019 K33N Gaming Community
