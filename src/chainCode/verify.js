
import {
    loadCandyProgram,
    loadWalletKey,
} from './helpers/accounts';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';


import {
    CONFIG_ARRAY_START,
    CONFIG_LINE_SIZE,
} from './helpers/constants';

import { fromUTF8Array } from './helpers/various';


export async function verify(
    keypairPath,
    env,
    configState,
    saveConfigState,
    log,
) {

    const walletKeyPair = loadWalletKey(keypairPath);
    const anchorProgram = await loadCandyProgram(walletKeyPair, env);

    const configAddress = new PublicKey(configState.program.config);
    const config = await anchorProgram.provider.connection.getAccountInfo(
        configAddress,
    );
    let allGood = true;

    const keys = Object.keys(configState.items);
    for (let i = 0; i < keys.length; i++) {
        log('Looking at key ' + i);
        const key = keys[i];
        const thisSlice = config.data.slice(
            CONFIG_ARRAY_START + 4 + CONFIG_LINE_SIZE * i,
            CONFIG_ARRAY_START + 4 + CONFIG_LINE_SIZE * (i + 1),
        );
        const name = fromUTF8Array([...thisSlice.slice(4, 36)]);
        const uri = fromUTF8Array([...thisSlice.slice(40, 240)]);
        const cacheItem = configState.items[key];
        if (!name.match(cacheItem.name) || !uri.match(cacheItem.link)) {
            cacheItem.onChain = false;
            allGood = false;
        } else {
            const json = await fetch(cacheItem.link);
            if (json.status == 200 || json.status == 204 || json.status == 202) {
                const body = await json.text();
                const parsed = JSON.parse(body);
                if (parsed.image) {
                    const check = await fetch(parsed.image);
                    if (
                        check.status == 200 ||
                        check.status == 204 ||
                        check.status == 202
                    ) {
                        const text = await check.text();
                        if (!text.match(/Not found/i)) {
                            if (text.length == 0) {
                                log(
                                    'Name',
                                    name,
                                    'with',
                                    uri,
                                    'has zero length, failing',
                                );
                                cacheItem.onChain = false;
                                allGood = false;
                            } else {
                                log('Name', name, 'with', uri, 'checked out');
                            }
                        } else {
                            log(
                                'Name',
                                name,
                                'with',
                                uri,
                                'never got uploaded to arweave, failing',
                            );
                            cacheItem.onChain = false;
                            allGood = false;
                        }
                    } else {
                        log(
                            'Name',
                            name,
                            'with',
                            uri,
                            'returned non-200 from uploader',
                            check.status,
                        );
                        cacheItem.onChain = false;
                        allGood = false;
                    }
                } else {
                    log('Name', name, 'with', uri, 'lacked image in json, failing');
                    cacheItem.onChain = false;
                    allGood = false;
                }
            } else {
                log('Name ', name, 'with', uri, 'returned no json from link');
                cacheItem.onChain = false;
                allGood = false;
            }
        }
    }

    if (!allGood) {
        saveConfigState(configState);

        throw new Error(
            `not all NFTs checked out. check out logs above for details`,
        );
    }

    const configData = (await anchorProgram.account.config.fetch(
        configAddress,
    ));

    const lineCount = new BN(config.data.slice(247, 247 + 4), undefined, 'le');

    log(
        `uploaded (${lineCount.toNumber()}) out of (${configData.data.maxNumberOfLines
        })`,
    );
    if (configData.data.maxNumberOfLines > lineCount.toNumber()) {
        throw new Error(
            `predefined number of NFTs (${configData.data.maxNumberOfLines
            }) is smaller than the uploaded one (${lineCount.toNumber()})`,
        );
    } else {
        log('ready to deploy!');
        saveConfigState(configState);
        return true
    }
}