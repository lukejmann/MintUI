import { CheckIcon, DocumentAddIcon } from '@heroicons/react/solid'
import { useState, useEffect } from 'react'

import UploadCreateConfig from './UploadCreateConfig';
import UploadVerify from './UploadVerify';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const fs = window.require('fs');
const path = window.require('path');


export default function UploadRun({ machineState, saveMachineState, setGoToCreate }) {
    const [assetList, setAssetList] = useState(null)
    const [uploadConfigSuccess, setUploadConfigSuccess] = useState(false)

    const filesLocked = () => {
        return machineState.lockedAssetLinks
    }

    const readyToVerify = () => {
        // console.log("in readyToVerify. machineState.configState:", machineState.configState)
        // if (machineState.configState?.items) {
        //     const values = Object.values(machineState.configState.items)
        //     let notOk = false
        //     values.forEach(item => {
        //         if (item.onChain !== true) {
        //             notOk = true
        //         }
        //     })
        //     return !notOk
        // }
        // return false
        return uploadConfigSuccess
    }

    const steps = () => [
        {
            name: 'Select asset files for upload', description: 'Select asset files for upload.', content:
                selectFilesContent(), status: !filesLocked() ? 'current' : 'done'
        },
        {
            name: 'Create metadata configuration', description: 'Craft Metaplex Candy Machine configuration for upload.', content:
                filesLocked() ? <UploadCreateConfig machineState={machineState} saveMachineState={saveMachineState} setUploadConfigSuccess={setUploadConfigSuccess} ></UploadCreateConfig> : null,
            status: !filesLocked() ? 'upcoming' : readyToVerify() ? 'done' : 'current'
        },
        {
            name: 'Verify upload', description: 'Query on-chain data to verify successful upload of Metaplex configuration.', content:
                readyToVerify() ? <UploadVerify machineState={machineState} saveMachineState={saveMachineState} ></UploadVerify> : <div></div>, status: readyToVerify() ? 'current' : 'upcoming'
        },
    ]

    function onChangeAssetListFile(event) {
        event.stopPropagation();
        event.preventDefault();
        var file = event.target.files[0];
        if (file.path) {
            const assetListPath = file.path
            fs.readFile(assetListPath, 'utf8', function (err, data) {
                if (err) return console.log(err);
                console.log(data);
                const c = JSON.parse(data)
                if (c.length > 0) {
                    setAssetList(c)
                }
            });
        }
    }

    const prepForUpload = () => {
        saveMachineState({ ...machineState, lockedAssetLinks: assetList, configState: {} })
    }

    const selectFilesContent = () => {
        return <div>
            {!filesLocked() && <div className="mt-1 flex justify-start px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <DocumentAddIcon></DocumentAddIcon>
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                            <span className="p-1">{assetList ? `${assetList.length} Assets Links Found` : "Select Asset List"}</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onChangeAssetListFile} />
                        </label>
                        {!assetList && <p className="pl-1">or drag and drop</p>}
                    </div>
                    {!false && <p className="text-xs text-gray-500 px-24">Must be a .json file with an array of metadata links as described in the README. This tool does not validate the file (yet!) so make sure they're perfect.</p>}
                </div>

            </div>}
            <div className="pt-5">
                {assetList &&
                    <div>
                        <div className="flex justify-center">
                            <div>
                                <button
                                    onClick={() => {
                                        prepForUpload()
                                    }}
                                    className={classNames("ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", filesLocked() ? "opacity-50 cursor-not-allowed" : "")}
                                >
                                    {!filesLocked() ? 'Select and Lock Files' : `${assetList.length} Asset Links Found`}
                                </button>
                            </div>
                        </div>
                        <div className="w-full mx-4 text-sm text-gray-600 text-center">Assets list cannot be changed after being set.</div>
                    </div>
                }
            </div>
        </div>
    }

    return (
        <div>
            <div aria-label="Progress" className="flex justify-center">
                <ol role="list" className="overflow-hidden w-full max-w-2xl ">
                    {steps().map((step, stepIdx) => (
                        <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'pb-10' : '', 'relative')}>
                            {step.status === 'complete' ? (
                                <>
                                    {stepIdx !== steps().length - 1 ? (
                                        <div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-blue-600" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex items-start group">
                                        <span className="h-9 flex items-center">
                                            <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full group-hover:bg-blue-800">
                                                <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
                                            </span>
                                        </span>
                                        <span className="ml-4 min-w-0 flex flex-col">
                                            <span className="text-xs font-semibold tracking-wide uppercase">{step.name}</span>
                                            <span className="text-sm text-gray-500">{step.description}</span>
                                        </span>
                                    </div>
                                    <div className="ml-12">
                                        {step.content}
                                    </div>
                                </>
                            ) : step.status === 'current' ? (
                                <>
                                    {stepIdx !== steps().length - 1 ? (
                                        <div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex items-start group" aria-current="step">
                                        <span className="h-9 flex items-center" aria-hidden="true">
                                            <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-blue-600 rounded-full">
                                                <span className="h-2.5 w-2.5 bg-blue-600 rounded-full" />
                                            </span>
                                        </span>
                                        <span className="ml-4 min-w-0 flex flex-col">
                                            <span className="text-xs font-semibold tracking-wide uppercase text-blue-600">{step.name}</span>
                                            <span className="text-sm text-gray-500">{step.description}</span>
                                        </span>
                                    </div>
                                    <div className="ml-12">
                                        {step.content}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {stepIdx !== steps().length - 1 ? (
                                        <div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex items-start group">
                                        <span className="h-9 flex items-center" aria-hidden="true">
                                            <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                                                <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" />
                                            </span>
                                        </span>
                                        <span className="ml-4 min-w-0 flex flex-col">
                                            <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">{step.name}</span>
                                            <span className="text-sm text-gray-500">{step.description}</span>
                                        </span>
                                    </div>
                                    <div className="ml-12">
                                        {step.content}
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ol>

            </div>
            <div className="pt-5">
                <div className="flex justify-end">
                    {machineState.configVerified &&
                        <button
                            onClick={() => {
                                setGoToCreate(true)
                            }}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Next
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}