# Not-Quite-Tako

A little emote helper bot for all those nitroless people on discord!

Created by justapyromaniac (me), with help from NxKarim (they also host the bot atm)

## FAQ

### The bot isn't sending emotes, it's just sending their name
Make sure your @everyone role is allowed to use external emotes. 
Discord uses this role for webhook perms, so it needs to be on for the webhook to use external emotes

## Commands

### Configuration
*   `/config nottako toggle <enabled>`: Enable/Disable the Not Quite Tako emoji replacement.
*   `/config nottako edits <enabled>`: Enable/Disable looking for emojis in edited messages.
*   `/config nottako editlimit <seconds>`: Set the time limit for processing edited messages.
*   `/config nottako replies <enabled>`: Enable/Disable replies in bot responses.
*   `/config nottako replylength <length>`: Set the character limit for the reply preview.
*   `/config nottako channels <action> <channel> <type>`: Configure allowed channels for Not Quite Tako emoji replacement.
*   `/config takogacha toggle <enabled>`: Enable/Disable TakoGacha.
*   `/config takogacha channels <action> <channel> <type>`: Configure allowed channels for TakoGacha commands.
*   `/config takogacha sources <action> <channel>`: Manage Tako source channels.
*   `/config botemoji set <name> <id>`: Set custom emoji to replace the ones the bot uses (tako, gold, silver, ao).
*   `/config botemoji list`: List current emoji overrides.

### TakoGacha
*   `/takogacha summon <wah>`: Summon Takodachis (Cost: 80 Ink/wah).
*   `/takogacha list option:collection`: View your collected Takos.
*   `/takogacha list option:all`: View all available Takos.
*   `/takogacha friend`: Manage your active Tako friend and level them up.
*   `/takogacha play game:mystery`: Play "Not quite a Mystery Button".
*   `/takogacha play game:trivia`: Play "Tentacular Trivia".
*   `/takogacha play game:whostako`: Play "Who's that Tako?!".
*   `/takogacha dailybonus`: Daily Ink claim.
*   `/takogacha help`: Help.

### Utilities
*   `/echo`: Repeats your message (if allowed).
*   `/reload`: Refreshes bot commands (Owner only).
*   `/featuredsrv`: Manage featured servers (Owner only).
*   `/antihoisting`: Anti-hoisting utilities.