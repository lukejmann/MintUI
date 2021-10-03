import { CheckIcon, DocumentAddIcon } from '@heroicons/react/solid'
import { useState, useEffect } from 'react'

import { update } from '../../chainCode/update';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const fs = window.require('fs');
const path = window.require('path');



export default function UpdateSection({ machineState, saveMachineState, price, startDate }) {
    // 0: not started, 1: started, 2: finished-failed, 3: finished-success
    const [updateStatus, setUpdateStatus] = useState(0)
    const [log, setLog] = useState([])
    const [errMsg, setErrMsg] = useState(null)
    const updateStatusMessage = () => {
        switch (updateStatus) {
            case 0: return '';
            case 1: return 'Updating candy machine...'
            case 2: return errMsg ? 'Update failed due to error. Error: ' + errMsg : "Update failed see above logs."
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
        return (!price && !startDate) || (updateStatus == 1 || updateStatus == 3)
    }

    const saveConfigState = (configState) => {
        saveMachineState({ ...machineState, configState: configState })
    }

    const startUpdate = async () => {
        setErrMsg(null)
        writeLog("Starting update")
        console.log("Starting update. price:", price)
        try {
            const success = await update(machineState.pubKeyPath, machineState.cluster, price, startDate, machineState, saveMachineState, writeLog)
            if (success) {
                setUpdateStatus(3)
            } else {
                setUpdateStatus(2)
            }
        } catch (e) {
            setErrMsg(e.message)
            setUpdateStatus(2)
            console.log("error:", e)
        }
    }

    return <div className="mt-4">
        <div className="">
            <button
                disabled={disabled()}
                onClick={() => {
                    startUpdate()
                    setUpdateStatus(1)
                }}
                className={classNames("inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", disabled() ? "opacity-50 cursor-not-allowed" : "")}
            >
                {updateStatus == 0 ? 'Update Candy Machine' : updateStatus == 1 ? 'Updating...' : updateStatus == 2 ? 'Try Again' : 'Update Successful'}
            </button>
            <div className="text-sm text-gray-500 mt-2">{updateStatusMessage()}</div>
        </div>
        {log.length > 0 && <div className="rounded-md bg-gray-300 font-mono text-xs p-2 w-full max-w-lg overflow-auto max-h-40">
            {log.map((str, i) => <p key={`${i}`}>{str}</p>)}
        </div>}

    </div>

}
