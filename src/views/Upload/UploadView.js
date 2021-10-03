import { CheckIcon } from '@heroicons/react/solid'
import SuccessModal from './SuccessModal'
import UploadInitCache from './UploadInitCache'
import UploadRun from './UploadRun'
import { useState } from 'react'
import CreateView from './CreateView'

export default function UploadView({ machineState, saveMachineState, showManage }) {
    const [goToCreate, setGoToCreate] = useState(false)

    const navStatus = () => {
        return [{ id: '01', name: 'Initialize cache', description: 'Create the initial cache state used by MintUI.', status: !machineState.cacheName ? 'current' : 'complete' },
        { id: '02', name: 'Upload metadata files', description: 'Create an upload a Metaplex Candy Machine Configuration.', status: machineState.configVerified && !goToCreate ? 'complete' : machineState.cacheName ? 'current' : 'upcoming' },
        { id: '03', name: 'Create candy machine', description: 'Create the Candy Machine.', status: machineState.machineCreated ? 'complete' : machineState.configVerified && goToCreate ? 'current' : 'upcoming' },
        ]
    }

    const [showSuccessModal, setShowSuccessModal] = useState(false)

    if (!machineState) {
        return <div></div>
    }

    const showCurrentStep = (navStatus) => {
        const activeStatus = navStatus.find(item => item.status === 'current')
        if (activeStatus?.id == '01') {
            return <UploadInitCache machineState={machineState} saveMachineState={saveMachineState}></UploadInitCache>
        } else if (activeStatus?.id == '02') {
            return <UploadRun machineState={machineState} saveMachineState={saveMachineState} setGoToCreate={setGoToCreate}></UploadRun>
        } else {
            return <CreateView machineState={machineState} saveMachineState={saveMachineState} setShowSuccessModal={setShowSuccessModal} />
        }
    }

    return (
        <div className="p-40 pt-20">
            <SuccessModal open={showSuccessModal} setOpen={setShowSuccessModal} showManage={showManage}></SuccessModal>
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-black sm:text-3xl sm:truncate">Upload</h2>
                </div>
            </div>
            <div className="lg:border-t lg:border-b lg:border-gray-200 mt-8">
                <nav aria-label="Progress">
                    <ol role="list" className="border border-gray-300 rounded-md divide-y divide-gray-300 md:flex md:divide-y-0">
                        {navStatus().map((step, stepIdx) => (
                            <li key={step.name} className="relative md:flex-1 md:flex">
                                {step.status === 'complete' ? (
                                    <a href={step.href} className="group flex items-center w-full">
                                        <span className="px-6 py-4 flex items-center text-sm font-medium">
                                            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full group-hover:bg-blue-800">
                                                <CheckIcon className="w-6 h-6 text-white" aria-hidden="true" />
                                            </span>
                                            <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{step.name}</span>
                                                <span className="text-sm font-medium text-gray-500">{step.description}</span>
                                            </span>

                                        </span>
                                    </a>
                                ) : step.status === 'current' ? (
                                    <a href={step.href} className="px-6 py-4 flex items-center text-sm font-medium" aria-current="step">
                                        <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-blue-600 rounded-full">
                                            <span className="text-blue-600">{step.id}</span>
                                        </span>
                                        <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                                            <span className="text-sm font-medium text-blue-600">{step.name}</span>
                                            <span className="text-sm font-medium text-gray-500">{step.description}</span>
                                        </span>

                                    </a>
                                ) : (
                                    <a href={step.href} className="group flex items-center">
                                        <span className="px-6 py-4 flex items-center text-sm font-medium">
                                            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                                                <span className="text-gray-500 group-hover:text-gray-900">{step.id}</span>
                                            </span>
                                            <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
                                                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</span>
                                                <span className="text-sm font-medium text-gray-500">{step.description}</span>
                                            </span>

                                        </span>
                                    </a>
                                )}
                                {stepIdx !== navStatus().length - 1 ? (
                                    <>
                                        {/* Arrow separator for lg screens and up */}
                                        <div className="hidden md:block absolute top-0 right-0 h-full w-5" aria-hidden="true">
                                            <svg
                                                className="h-full w-full text-gray-300"
                                                viewBox="0 0 22 80"
                                                fill="none"
                                                preserveAspectRatio="none"
                                            >
                                                <path
                                                    d="M0 -2L20 40L0 82"
                                                    vectorEffect="non-scaling-stroke"
                                                    stroke="currentcolor"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </>
                                ) : null}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
            <div className="mt-12">
                {showCurrentStep(navStatus())}
            </div>
        </div>

    )
}