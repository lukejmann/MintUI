# An extensible UI for creating Metaplex Candy Machines

This project is a local Electron app which provides an interface and some extra conveniences for executing Solana smart contracts to create and manage Metaplex Candy Machines.

https://user-images.githubusercontent.com/28356568/135772190-7c387046-b9e6-4427-8099-fac81728e900.mp4

## Installation

Clone the repo, and run `yarn start` to deploy.

```bash
$ git clone https://github.com/lukejmann/MintUI.git
$ cd MintUI
$ yarn install
$ yarn start
```

## Using the program

Running `yarn start` will open an Electron window with MintUI.

MintUI uses cache files for each Candy Machine it creates and manages which are stored by default in `./cache`; on launch you'll be prompted to load-in an existing cache file or create a new one.

## Assets List

Whereas [Metaplex's candy machine CLI](https://github.com/metaplex-foundation/metaplex/tree/master/js/packages/cli) crafts manifest files for the user, we decided against this approach because it limits the manifest files to matching a specific PNG+metadata composition.

During the Upload step, MintUI asks for an Asset Links JSON file. This file should be a JSON array with links to Metadata files:

`[
"https://url.com/asset_metadata.json",

]`

## It's not perfect

This tool is a work in progress and we figured it'd be better for the community to release what we have and improve it with time. It works well for most use cases, but there are bound to be some edge errors, etc. If you run into errors try enabling the Chrome dev tools in `public/electron.js` to debug.

As always, test everything on `devnet` before switching to `mainnet-beta`

## Roadmap

- Optional assets uploads to Arweave and IPFS
- Compiled executables

## Community contributions

Pull requests are more than welcome!

## Acknowledgments

The code of course would not be possible without the amazing work of the Metaplex team and the contributors to their [codebase](https://github.com/metaplex-foundation/metaplex/).
