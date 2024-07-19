# ComposeDB with TACo Protocol: Message Board

Learn how to use TACo Protocol to encrypt and decrypt data based on on-chain condition logic while storing on ComposeDB,
built on the Ceramic Network.

## Getting Started

---
**NOTE**

* Your Metamask has to be switched to Polygon Amoy network and your address must have
a positive balance of Matic to do the decryption.
* Ensure you are running node `v16` in your terminal
---

1. Install your dependencies:

Install your dependencies:

```bash
npm install
```

2. Generate your admin seed, admin did, and ComposeDB configuration file:

```bash
npm run generate
```

3. Run your application (you can simply execute this step for subsequent runs):

```bash
npm run dev
```
*To reset between runs of the demo, execute `localStorage.clear()` from the Javascript console.* 

## Learn More

To learn more about TACo please visit the following links:
- [TACo Documentation](https://docs.threshold.network/app-development/threshold-access-control-tac)
- [Threshold Discord](https://discord.gg/threshold)

To learn more about Ceramic please visit the following links:

- [Ceramic Documentation](https://developers.ceramic.network/learn/welcome/) - Learn more about the Ceramic Ecosystem.
- [ComposeDB](https://composedb.js.org/) - Details on how to use and develop with ComposeDB!
- [Ceramic Discord](https://discord.com/invite/ceramic) - Join the Ceramic Discord

## License

Dual licensed under [MIT](LICENSE-MIT) and [Apache 2](LICENSE-APACHE)
