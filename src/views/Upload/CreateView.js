import { useState } from 'react'
import UploadCreateSection from './UploadCreateSection'


export default function CreateView({ machineState, saveMachineState, setShowSuccessModal }) {
    const [mintPrice, setMintPrice] = useState(null)
    const [dateTime, setDateTime] = useState(new Date())

    const readyToSubmit = () => {
        return mintPrice && dateTime
    }

    return (
        <div className="">
            {!machineState.machineAddress ? <div className="space-y-8 divide-y divide-gray-200">
                <div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="mintPrice" className="block text-sm font-medium text-gray-700">
                                Mint Price
                            </label>
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
                    </div>
                </div>
            </div> : <div></div>
            }
            {readyToSubmit() &&
                <div className="flex justify-center pt-4">

                </div>
            }
            <UploadCreateSection machineState={machineState} saveMachineState={saveMachineState} price={mintPrice} setShowSuccessModal={setShowSuccessModal}></UploadCreateSection>
        </div>

    )
}