<p align="center">
  <a href="https://innermind.space">
    <img alt="Metaplex" src="public/mintUILogo.png" width="300" />
  </a>
</p>

# An extensible UI for creating Metaplex Candy Machines

This project is a local electron app which provides an interface and some extra conveniences for executing Solana smart contracts to create and manage Metaplex Candy Machine.

https://user-images.githubusercontent.com/28356568/135772190-7c387046-b9e6-4427-8099-fac81728e900.mp4


## Installation

Clone the repo, and run `yarn start` to deploy.

```bash
$ git clone https://github.com/InnerMindDAO/MintUI.git
$ cd MintUI
$ yarn install
$ yarn start
```
## Using the program

Running `yarn start` will open an Electron window with MintUI. 

MintUI uses cache files for each Candy Machine it creates and manages which are stored by default in `./cache`; on launch you'll be prompted to load-in an existing cache file or create a new one.

## Assets List

Whereas [Metaplex's candy machine CLI](https://github.com/metaplex-foundation/metaplex/tree/master/js/packages/cli) crafts manifests files for the user, we decided against this approach because it limits the manifest files to matching a specific PNG+metadata composition. We originally wrote large chunks of this codebase to get around these restrictions in order to mint our [Portals](https://innermind.space) (Portals are GIFs and MP4s, which the Metaplex code does not support). Our hope is that the task of crafting the JSON metadata files is manageable by most creators, and this codebase can handle the more technically-intensive smart contract interactions.

During the Upload step, MintUI asks for an Asset Links JSON file. This file should be a JSON array with links to Metadata files. Here's an example with Portal Metadata links we used on `devnet` during development:

`[
    "https://innermind-portals.mypinata.cloud/ipfs/QmVkUn2922exAdYbfPDAkpLK9aacahtKd5YijkqwL6wzVM",
    "https://innermind-portals.mypinata.cloud/ipfs/QmZReHMeiFF83SUYJ3mB5Mb4V7QoCup5P1cXDtF4kNW4Zd",
    "https://innermind-portals.mypinata.cloud/ipfs/QmbPkCKtyFLsZ53xzGNVf5zmCEVpuGsDfYAvVPineXvuYw"
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
