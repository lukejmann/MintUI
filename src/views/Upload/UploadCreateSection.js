import { CheckIcon, DocumentAddIcon } from '@heroicons/react/solid'
import { useState, useEffect } from 'react'

import { create } from '../../chainCode/create';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const fs = window.require('fs');
const path = window.require('path');



export default function UploadCreateSection({ machineState, saveMachineState, price, setShowSuccessModal }) {
    // 0: not started, 1: started, 2: finished-failed, 3: finished-success
    const [createStatus, setCreateStatus] = useState(0)
    const [log, setLog] = useState([])
    const [errMsg, setErrMsg] = useState(null)
    const createStatusMessage = () => {
        switch (createStatus) {
            case 0: return '';
            case 1: return 'Creating candy machine...'
            case 2: return errMsg ? 'Creatoin failed due to error. Error: ' + errMsg : "Creation failed see above logs."
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

    const saveConfigState = (configState) => {
        saveMachineState({ ...machineState, configState: configState })
    }

    const startCreation = async () => {
        setErrMsg(null)
        try {
            const machineAddress = await create(machineState.pubKeyPath, machineState.cluster, price, machineState.configState, writeLog)
            if (machineAddress) {
                saveMachineState({ ...machineState, machineAddress: machineAddress })
                setCreateStatus(3)
                setShowSuccessModal(true)
            } else {
                setCreateStatus(2)
            }
        } catch (e) {
            setErrMsg(e.message)
            setCreateStatus(2)
            console.log("error:", e)
        }
    }

    return <div className="mt-4">
        <div className="">
            <button
                disabled={!price || (createStatus == 1 || createStatus == 3 || machineState.machineAddress)}
                onClick={() => {
                    startCreation()
                    setCreateStatus(1)
                }}
                className={classNames("inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", !price || createStatus == 1 || createStatus == 3 || machineState.machineAddress ? "opacity-50 cursor-not-allowed" : "")}
            >
                {machineState.machineAddress ? "Candy Machine Created" : createStatus == 0 ? 'Create Candy Machine' : createStatus == 1 ? 'Creating...' : createStatus == 2 ? 'Failed' : 'Creation Successful'}
            </button>
            <div className="text-sm text-gray-500 mt-2">{createStatusMessage()}</div>
        </div>
        {log.length > 0 && <div className="rounded-md bg-gray-300 font-mono text-xs p-2 w-full max-w-lg overflow-auto max-h-40">
            {log.map((str, i) => <p key={`${i}`}>{str}</p>)}
        </div>}

    </div>

}
