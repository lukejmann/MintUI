import { useState } from 'react'

import {
    KeyIcon
} from '@heroicons/react/outline'

export default function UploadInitCache({ saveMachineState }) {
    const [cluster, setCluster] = useState("devnet");
    const [pubKeyPath, setPubKeyPath] = useState(null);
    const [cacheName, setCacheName] = useState(null);

    const readyToSubmit = () => {
        return cluster && pubKeyPath && cacheName;
    }

    function onChangePubkey(event) {
        event.stopPropagation();
        event.preventDefault();
        var file = event.target.files[0];
        console.log('file', file);
        if (file.path) {
            setPubKeyPath(file.path)
        }
    }

    const craftFirstCache = () => {
        console.log(cluster)
        return {
            cluster: cluster,
            pubKeyPath: pubKeyPath,
            cacheName: cacheName
        }
    }

    return (
        <div className="space-y-8 divide-y divide-gray-200">
            <div className="space-y-8 divide-y divide-gray-200">
                <div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                Cache Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="cacheName"
                                    id="cacheName"
                                    autoComplete="cacheName"
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    onChange={(e) => setCacheName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="cluster" className="block text-sm font-medium text-gray-700">
                                Solana Cluster
                            </label>
                            <div className="mt-1">
                                <select
                                    id="cluster"
                                    name="cluster"
                                    autoComplete="cluster"
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    onChange={(e) => { 
                                        setCluster(e.target.value);
                                    }}
                                >
                                    <option>devnet</option>
                                    <option>testnet</option>
                                    <option>mainnet-beta</option>
                                </select>
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700">
                                Wallet Pubkey
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <KeyIcon></KeyIcon>
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                        >
                                            <span className="p-1">{!pubKeyPath ? "Select a pubkey" : pubKeyPath}</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onChangePubkey} />
                                        </label>
                                        {!pubKeyPath && <p className="pl-1">or drag and drop</p>}
                                    </div>
                                    {!pubKeyPath && <p className="text-xs text-gray-500">Must be .json</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {readyToSubmit() &&
                <div className="flex justify-center pt-4">
                    <span className="inline-flex items-center px-3 rounded-md border bg-gray-50 text-gray-500 sm:text-sm h-12">
                        Cache file will be saved to:&nbsp;<span className="font-medium">{`${cluster}-${cacheName}.json`}</span>
                    </span>
                </div>
            }

            <div className="pt-5">
                <div className="flex justify-end">
                    {readyToSubmit() &&
                        <button
                            onClick={() => {
                                saveMachineState(craftFirstCache());
                            }}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Create Cache File
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}
