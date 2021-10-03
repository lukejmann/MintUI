
import { PublicKey } from '@solana/web3.js';
import { parsePrice } from './helpers/various';
import {
    getCandyMachineAddress,
    loadCandyProgram,
    loadWalletKey,
} from './helpers/accounts';
import * as anchor from '@project-serum/anchor';


export async function create(
    keypairPath,
    env,
    price,
    configState,
    log,
) {

    let parsedPrice = parsePrice(price);

    const walletKeyPair = loadWalletKey(keypairPath);
    const anchorProgram = await loadCandyProgram(walletKeyPair, env);

    let wallet = walletKeyPair.publicKey;
    const remainingAccounts = [];


    const config = new PublicKey(configState.program.config);
    const [candyMachine, bump] = await getCandyMachineAddress(
        config,
        configState.program.uuid,
    );
    await anchorProgram.rpc.initializeCandyMachine(
        bump,
        {
            uuid: configState.program.uuid,
            price: new anchor.BN(parsedPrice),
            itemsAvailable: new anchor.BN(Object.keys(configState.items).length),
            goLiveDate: null,
        },
        {
            accounts: {
                candyMachine,
                wallet,
                config: config,
                authority: walletKeyPair.publicKey,
                payer: walletKeyPair.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            },
            signers: [],
            remainingAccounts,
        },
    );
    const candyMachineAddress = candyMachine.toBase58();
    log(
        `create_candy_machine finished. candy machine pubkey: ${candyMachine.toBase58()}`,
    );
    return candyMachineAddress
}
