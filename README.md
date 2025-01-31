# TACo with ComposeDB: Message Board Application

This simple browser-based messaging application illustrates how to integrate TACo's encrypt/decrypt API and predicate access to private data on prespecified on-chain conditions – all while storing the encrypted data on ComposeDB.

Note that this demo is based on a fork of ceramicstudio’s lit-composedb repo, with the TACo library replacing LIT. This demonstrates that developers who have already integrated LIT’s permissioned service can easily substitute it for TACo’s decentralized access control plugin.

## Getting Started

---

This demo requires:
* A Metamask wallet with Polygon Amoy testnet added, and multiple accounts to mimic a real-world decryption flow.
* A positive balance of Polygon Amoy testnet tokens (> 0.00 MATIC) held in one of the accounts, in order to satisfy the default access conditions.
* Node `v16` running in your terminal.
---

1. Install your dependencies:

```bash
npm install
```

2. Generate your admin seed, admin did, and ComposeDB configuration file:

```bash
npm run generate
```

3. Run your application (for subsequent runs, only this step is required):

```bash
npm run dev
```

The application will run on http://localhost:3000.

To reset the message and session data between runs of the demo, click the `Reset` button on the navigation bar.

## Learn More

To learn more about TACo please visit the following links:
- [TACo homepage](https://threshold.network/build/taco/)
- [TACo documentation](https://docs.taco.build/)
- [Threshold discord](https://discord.gg/threshold)

To learn more about Ceramic please visit the following links:

- [Ceramic documentation](https://developers.ceramic.network/learn/welcome/) - Learn more about the Ceramic Ecosystem.
- [ComposeDB](https://composedb.js.org/) - Details on how to use and develop with ComposeDB!
- [Ceramic discord](https://discord.com/invite/ceramic) - Join the Ceramic Discord

## License

Dual licensed under [MIT](LICENSE-MIT) and [Apache 2](LICENSE-APACHE).
