# Running Fish Bot

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
