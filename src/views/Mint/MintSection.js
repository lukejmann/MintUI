import { CheckIcon, DocumentAddIcon } from '@heroicons/react/solid'
import { useState, useEffect } from 'react'

import { mint } from '../../chainCode/mint';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const fs = window.require('fs');
const path = window.require('path');



export default function MintSection({ machineState, saveMachineState }) {
    // 0: not started, 1: started, 2: finished-failed, 3: finished-success
    const [mintStatus, setMintStatus] = useState(0)
    const [log, setLog] = useState([])
    const [errMsg, setErrMsg] = useState(null)
    const mintStatusMessage = () => {
        switch (mintStatus) {
            case 0: return '';
            case 1: return 'Minting one token...'
            case 2: return errMsg ? 'Minting failed due to error. Error: ' + errMsg : "Minting failed. See above logs."
            case 3: return 'Success'
        }
    }

    const writeLog = (msg) => {
        let newLine = ""
        if (typeof (msg) == 'array') {
            msg.forEach(m => {
                newLine += m + " "
            })
        } else newLine = msg;
        setLog(oldLog => [...oldLog, newLine])
    }

    const disabled = () => {
        return (mintStatus == 1)
    }

    const startMint = async () => {
        setErrMsg(null)
        console.log("Starting mint.", machineState)
        try {
            const txid = await mint(machineState.pubKeyPath, machineState.cluster, machineState)
            if (txid) {
                setMintStatus(3)
                writeLog("Minting finished. Transaction ID: " + txid)
            } else {
                setMintStatus(2)
            }
        } catch (e) {
            setErrMsg(e.message)
            setMintStatus(2)
            console.log("error:", e)
        }
    }

    return <div className="mt-4">
        <div className="">
            <button
                disabled={disabled()}
                onClick={() => {
                    startMint()
                    setMintStatus(1)
                }}
                className={classNames("inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", disabled() ? "opacity-50 cursor-not-allowed" : "")}
            >
                {mintStatus == 0 ? 'Mint One Token' : mintStatus == 1 ? 'Minting...' : mint == 2 ? 'Try Again' : 'Mint Another'}
            </button>
            <div className="text-sm text-gray-500 mt-2">{mintStatusMessage()}</div>
        </div>
        {log.length > 0 && <div className="rounded-md bg-gray-300 font-mono text-xs p-2 w-full max-w-lg overflow-auto max-h-40">
            {log.map((str, i) => <p key={`${i}`}>{str}</p>)}
        </div>}

    </div>

}
