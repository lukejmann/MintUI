import { useState } from 'react'

import { upload } from "../../chainCode/upload"

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function UploadCreateConfig({ machineState, saveMachineState, setUploadConfigSuccess }) {
    // 0: not started, 1: started, 2: finished-failed, 3: finished-success
    const [uploadStatus, setUploadStatus] = useState(0)
    const [log, setLog] = useState([])
    const [errMsg, setErrMsg] = useState(null)
    const uploadStatusMessage = () => {
        switch (uploadStatus) {
            case 0: return '';
            case 1: return 'Running upload'
            case 2: return errMsg ? 'Upload failed due to error. Error: ' + errMsg : "Upload failed. Press Re-try Upload to continue."
            case 3: return 'Success'
        }
    }

    const now = new Date()

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

    const startUpload = async () => {
        setErrMsg(null)
        try {
            const successful = await upload(machineState.pubKeyPath, machineState.cluster, machineState.lockedAssetLinks, true, machineState.configState, saveConfigState, writeLog)
            if (successful) {
                setUploadStatus(3)
                setUploadConfigSuccess(true)

            } else {
                setUploadStatus(2)
            }
        } catch (e) {
            setErrMsg(e.message)
            setUploadStatus(2)
            console.log("error:", e)
        }
    }

    return <div className="ml-3 mt-4">
        <div className="">
            <button
                disabled={(uploadStatus == 1 || uploadStatus == 3)}
                onClick={() => {
                    startUpload()
                    setUploadStatus(1)
                }}
                className={classNames("inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", uploadStatus == 1 || uploadStatus == 3 ? "opacity-50 cursor-not-allowed" : "")}
            >
                {uploadStatus == 0 ? 'Begin Upload' : uploadStatus == 1 ? 'Uploading...' : uploadStatus == 2 ? 'Re-try Upload' : 'Upload Successful'}
            </button>
            <div className="text-sm text-gray-500 mt-2">{uploadStatusMessage()}</div>
        </div>
        {log.length > 0 && <div className="rounded-md bg-gray-300 font-mono text-xs p-2 w-full max-w-lg overflow-auto h-40">
            {log.map((str, i) => <p key={`${i}`}>{str}</p>)}
        </div>}
    </div>
}