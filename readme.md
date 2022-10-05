# Running Fish Bot

## Maybe strange styling choices:

1. `export const ENV_VARIABLE_NAME = process.env.ENV_VARIABLE_NAME;` using capitalized snake case here becuase these are effectively global variables.
2. `export enum DiscordType { GUILD_TEXT = 1}` the property is capitalized snake case because discord api does it so doing it for consistenty

Everything else should follow standard typescript guidelines

## Setup env variables

// TODO: write about setup env variables

## DB migrations

```bash
docker-compose build db-migration
docker-compose run --rm db-migration
```

## Development

```bash
docker-compose up app
```

## Testing

In a separate terminal somewhere

```
ngrok http 3000
```

then go to `http://localhost:4040/inspect/http`

ngrok will give you a temporary url, go update your bot's `NTERACTIONS ENDPOINT URL` here: `https://discord.com/developers/applications`

## More resources:

https://github.com/discord/discord-example-app/tree/main/examples

https://discord.com/developers/docs/interactions/application-commands

https://knexjs.org

https://devhints.io/knex

https://en.wikipedia.org/wiki/Snowflake_ID

## Notes about fflogs

### Difficulty

```json
{
    "id": 101,
    "name": "Savage",
    "sizes": [
        8
    ]
},
{
    "id": 100,
    "name": "Normal",
    "sizes": [
        8
    ]
},
{
    "id": 10,
    "name": "Dungeon",
    "sizes": [
        4
    ]
}
```
