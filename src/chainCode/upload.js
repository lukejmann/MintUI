
import {
    createConfig,
    loadCandyProgram,
    loadWalletKey,
} from './helpers/accounts';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { chunks } from './helpers/various';

export async function upload(
    keypairPath,
    env,
    assetLinks,
    retainAuthority,
    configState,
    saveConfigState,
    log,
) {
    log("\n\nUploading...")
    let uploadSuccessful = true;

    if (!configState.program) {
        configState.program = {};
    }

    let existingInCache = [];
    if (!configState.items) {
        configState.items = {};
    } else {
        existingInCache = Object.keys(configState.items);
    }

    const walletKeyPair = loadWalletKey(keypairPath);
    const anchorProgram = await loadCandyProgram(walletKeyPair, env);

    let config = configState.program.config
        ? new PublicKey(configState.program.config)
        : undefined;

    const SIZE = assetLinks.length;

    for (let i = 0; i < SIZE; i++) {
        log(`Processing file: ${i}`);
        if (i % 50 === 0) {
            log(`Processing file: ${i}`);
        }
        const index = `${i}`

        let link = configState?.items?.[index]?.link;
        if (!link || !configState.program.uuid) {
            if (i === 0 && !configState.program.uuid) {
                // fetch json file stored at assetLinks[0] for metadata info to create config
                console.log('fetching metadata file' + assetLinks[0]);
                const jsonFile = await fetch(assetLinks[0]);
                console.log("jsonFile", jsonFile)
                const manifest = await jsonFile.json();
                if (!manifest) {
                    log('Error fetching assetLinks[0]');
                    return
                }
                console.log("manifest", manifest)
                if (!manifest.seller_fee_basis_points || manifest.properties?.creators?.length < 1 || !manifest.properties?.creators?.[0]?.address || !manifest.properties?.creators?.[0]?.share) {
                    log('Error reading assetLinks[0]');
                    return
                }
                if (!manifest.symbol) {
                    manifest.symbol = "";
                }

                log(`initializing config`);
                try {
                    const res = await createConfig(anchorProgram, walletKeyPair, {
                        maxNumberOfLines: new BN(assetLinks.length),
                        symbol: manifest.symbol,
                        sellerFeeBasisPoints: manifest.seller_fee_basis_points,
                        isMutable: true,
                        maxSupply: new BN(0),
                        retainAuthority: retainAuthority,
                        creators: manifest.properties.creators.map(creator => {
                            return {
                                address: new PublicKey(creator.address),
                                verified: true,
                                share: creator.share,
                            };
                        }),
                    });
                    configState.program.uuid = res.uuid;
                    configState.program.config = res.config.toBase58();
                    config = res.config;

                    log(
                        `initialized config for a candy machine with publickey: ${res.config.toBase58()}`,
                    );

                    saveConfigState(configState);
                } catch (exx) {
                    log('Error deploying config to Solana network.', exx);
                    throw exx;
                }
            }

            if (!link) {
                try {
                    link = assetLinks[i];
                    if (link) {
                        log('setting config state for ', index);
                        configState.items[index] = {
                            link,
                            name: `${i}`,
                            onChain: false,
                        };
                        configState.authority = walletKeyPair.publicKey.toBase58();
                        saveConfigState(configState);
                    }
                } catch (er) {
                    uploadSuccessful = false;
                    log(`Error uploading file ${index}`, er);
                }
            }
        }
    }

    const keys = Object.keys(configState.items);
    try {
        await Promise.all(
            chunks(Array.from(Array(keys.length).keys()), 1000).map(
                async allIndexesInSlice => {
                    for (
                        let offset = 0;
                        offset < allIndexesInSlice.length;
                        offset += 5
                    ) {
                        const indexes = allIndexesInSlice.slice(offset, offset + 5);
                        const onChain = indexes.filter(i => {
                            const index = keys[i];
                            return configState.items[index]?.onChain || false;
                        });
                        const ind = keys[indexes[0]];

                        if (onChain.length != indexes.length) {
                            log(
                                `Writing indices ${ind}-${keys[indexes[indexes.length - 1]]}`,
                            );
                            try {
                                await anchorProgram.rpc.addConfigLines(
                                    ind,
                                    indexes.map(i => ({
                                        uri: configState.items[keys[i]].link,
                                        name: configState.items[keys[i]].name,
                                    })),
                                    {
                                        accounts: {
                                            config,
                                            authority: walletKeyPair.publicKey,
                                        },
                                        signers: [walletKeyPair],
                                    },
                                );
                                indexes.forEach(i => {
                                    configState.items[keys[i]] = {
                                        ...configState.items[keys[i]],
                                        onChain: true,
                                    };
                                });
                                saveConfigState(configState);
                            } catch (e) {
                                log(
                                    `saving config line ${ind}-${keys[indexes[indexes.length - 1]]
                                    } failed`,
                                    e,
                                );
                                uploadSuccessful = false;
                            }
                        }
                    }
                },
            ),
        );
    } catch (e) {
        log(e);
    } finally {
        saveConfigState(configState);
    }
    if (uploadSuccessful) {
        log('Upload successful');
    } else {
        log('Upload failed');
    }
    return uploadSuccessful;
}
