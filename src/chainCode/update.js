
import { PublicKey } from '@solana/web3.js';
import fs from 'fs';
import BN from 'bn.js';
import { fromUTF8Array, parseDate, parsePrice } from './helpers/various';
import {
    getCandyMachineAddress,
    loadCandyProgram,
    loadWalletKey,
} from './helpers/accounts';
import * as anchor from '@project-serum/anchor';


export async function update(
    keypairPath,
    env,
    price,
    date,
    machineState,
    saveMachineState,
    log,
) {
    const secondsSinceEpoch = date ? parseDate(date) : null;
    const lamports = price ? parsePrice(price) : null;

    const walletKeyPair = loadWalletKey(keypairPath);
    const anchorProgram = await loadCandyProgram(walletKeyPair, env);


    const candyMachine = new PublicKey(machineState.machineAddress);
    const tx = await anchorProgram.rpc.updateCandyMachine(
        lamports ? new anchor.BN(lamports) : null,
        secondsSinceEpoch ? new anchor.BN(secondsSinceEpoch) : null,
        {
            accounts: {
                candyMachine,
                authority: walletKeyPair.publicKey,
            },
        },
    );


    machineState.startDate = secondsSinceEpoch;
    saveMachineState(machineState)
    if (date)
        log(
            ` - updated startDate timestamp: ${secondsSinceEpoch} (${date})`,
        );
    if (lamports)
        log(` - updated price: ${lamports} lamports (${price} SOL)`);
    log('updated_candy_machine finished', tx);
    return true
}
