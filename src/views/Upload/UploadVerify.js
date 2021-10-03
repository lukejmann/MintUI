import { useState } from 'react'

import { verify } from '../../chainCode/verify';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function UploadVerify({ machineState, saveMachineState }) {
    // 0: not started, 1: started, 2: finished-failed, 3: finished-success
    const [verifyStatus, setVerifyStatus] = useState(0)
    const [log, setLog] = useState([])
    const [errMsg, setErrMsg] = useState(null)
    const verifyStatusMessage = () => {
        switch (verifyStatus) {
            case 0: return '';
            case 1: return 'Running verification'
            case 2: return errMsg ? 'Verification failed due to error. Error: ' + errMsg : "Verification failed."
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

    const startVerification = async () => {
        setErrMsg(null)
        try {
            const successful = await verify(machineState.pubKeyPath, machineState.cluster, machineState.configState, saveConfigState, writeLog)
            if (successful) {
                saveMachineState({ ...machineState, configVerified: true })
                setVerifyStatus(3)
            } else {
                setVerifyStatus(2)
            }
        } catch (e) {
            setErrMsg(e.message)
            setVerifyStatus(2)
            console.log("error:", e)
        }
    }

    return <div className="ml-3 mt-4">
        <div className="">
            <button
                disabled={(verifyStatus == 1 || verifyStatus == 3 || machineState.configVerified)}
                onClick={() => {
                    startVerification()
                    setVerifyStatus(1)
                }}
                className={classNames("inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", verifyStatus == 1 || verifyStatus == 3 || machineState.configVerified ? "opacity-50 cursor-not-allowed" : "")}
            >
                {machineState.configVerified ? "Verified" : verifyStatus == 0 ? 'Begin Verification' : verifyStatus == 1 ? 'Verifying...' : verifyStatus == 2 ? 'Re-try Verification' : 'Verification Successful'}
            </button>
            <div className="text-sm text-gray-500 mt-2">{verifyStatusMessage()}</div>
        </div>
        {log.length > 0 && <div className="rounded-md bg-gray-300 font-mono text-xs p-2 w-full max-w-lg overflow-auto h-40">
            {log.map((str, i) => <p key={`${i}`}>{str}</p>)}
        </div>}

    </div>

}
