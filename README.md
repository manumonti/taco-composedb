# ComposeDB with TACo Protocol: Message Board

Learn how to use TACo Protocol to encrypt and decrypt data based on on-chain condition logic while storing on ComposeDB,
built on the Ceramic Network.

For an implementation using Web3Modal for authentication, check out the `with-web3modal` branch.

## Getting Started

Before you start, make sure you update the `@nucypher/*` dependencies with a local copy of the `@nucypher/*` packages:
```
"@nucypher/taco": "file:<path-to-nucypher-ts-mono>/packages/taco",
"@nucypher/taco-auth": "file:<path-to-nucypher-ts-mono>/packages/taco-auth",
```

Updated instructions. If we were to use the original instructions, we may run into a confusing error:

```
FetchError: request to http://localhost:7007/api/v0/streams failed, reason: connect ECONNREFUSED ::1:7007
```

To avoid error, run:

```
npm install
npm run generate
npm run ceramic:local
# now, in another terminal
npm run nextDev
```

## Getting Started - Original Instructions

1. Install your dependencies:

Install your dependencies:

```bash
npm install
```

2. Generate your admin seed, admin did, and ComposeDB configuration file:

```bash
npm run generate
```

3. Finally, run your application in a new terminal (first ensure you are running node v16 in your terminal):

```bash
npm run dev
```

## Learn More

To learn more about Ceramic please visit the following links

- [Ceramic Documentation](https://developers.ceramic.network/learn/welcome/) - Learn more about the Ceramic Ecosystem.
- [ComposeDB](https://composedb.js.org/) - Details on how to use and develop with ComposeDB!
- [AI Chatbot on ComposeDB](https://learnweb3.io/lessons/build-an-ai-chatbot-on-compose-db-and-the-ceramic-network) -
  Build an AI-powered Chatbot and save message history to ComposeDB
- [ComposeDB API Sandbox](https://composedb.js.org/sandbox) - Test GraphQL queries against a live dataset directly from
  your browser
- [Ceramic Blog](https://blog.ceramic.network/) - Browse technical tutorials and more on our blog
- [Ceramic Discord](https://discord.com/invite/ceramic) - Join the Ceramic Discord
- [Follow Ceramic on Twitter](https://twitter.com/ceramicnetwork) - Follow us on Twitter for latest announcements!

## License

Dual licensed under [MIT](LICENSE-MIT) and [Apache 2](LICENSE-APACHE)
