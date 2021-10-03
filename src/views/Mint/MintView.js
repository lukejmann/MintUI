import MintSection from './MintSection';

export default function MintView({ machineState, saveMachineState }) {
    return (
        <div className="p-40 pt-20">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-black sm:text-3xl sm:truncate">Mint Token</h2>
                    <h1 className="mt-12 text-xl font-bold leading-7 text-black sm:text-xl sm:truncate">Mint One</h1>
                    <div className="text-xs text-gray-500">The token will be minted to the connected wallet</div>
                    <MintSection machineState={machineState} saveMachineState={saveMachineState}></MintSection>
                </div>
            </div>
        </div>
    );
}