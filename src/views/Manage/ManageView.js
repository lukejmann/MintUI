import { useState } from 'react'
import UpdateSection from './UpdateSection';


export default function ManageView({ machineState, saveMachineState }) {
    const [mintPrice, setMintPrice] = useState(machineState.mintPrice);
    const [startDate, setStartDate] = useState(machineState.startDate);
    return (
        <div className="p-40 pt-20">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-black sm:text-3xl sm:truncate">Manage Mint Machine</h2>
                    <div className="flex-col  pt-4">
                        <span className="inline-flex items-center px-3 rounded-md border bg-gray-50 text-gray-500 sm:text-sm h-12">
                            Mint Machine address:&nbsp;<span className="font-medium">{`${machineState.machineAddress}`}</span>
                        </span>
                        <span className="mt-2 inline-flex items-center px-3 rounded-md border bg-gray-50 text-gray-500 sm:text-sm h-12">
                            Machine config address:&nbsp;<span className="font-medium">{`${machineState.configState?.program?.config}`}</span>
                        </span>
                    </div>
                    <h1 className="mt-12 text-xl font-bold leading-7 text-black sm:text-xl sm:truncate">Update Mint Machine Price</h1>
                    <div className="grid grid-cols-2 mt-4 gap-6">
                        <div className="sm:col-span-1">
                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                Mint Price
                            </label>
                            <div className="text-xs text-gray-500">SOL</div>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="mintPrice"
                                    id="mintPrice"
                                    autoComplete="mintPrice"
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    onChange={(e) => setMintPrice(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <div className="text-xs text-gray-500">Must match format "20 Apr 2021 04:20:00 GMT"</div>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="startDate"
                                    id="startDate"
                                    autoComplete="mintPrice"
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <UpdateSection machineState={machineState} saveMachineState={saveMachineState} price={mintPrice} startDate={startDate}></UpdateSection>
                </div>
            </div>
        </div>
    );
}