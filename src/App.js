
import { useState } from 'react'
import {
  MenuIcon,
  UploadIcon,
  PlusCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/outline'

import {

  loadWalletKey,
} from './chainCode/helpers/accounts';

import StartModal from './views/StartModal'
import UploadView from './views/Upload/UploadView';
import ManageView from './views/Manage/ManageView';
import MintView from './views/Mint/MintView';

const fs = window.require('fs');
const path = window.require('path');

const CACHE_PATH = './cache/'


const initialNav = [
  { name: 'Create', href: '#', icon: UploadIcon, current: false, disabled: false },
  { name: 'Manage', href: '#', icon: InformationCircleIcon, current: false, disabled: true },
  { name: 'Mint', href: '#', icon: PlusCircleIcon, current: false, disabled: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [startModalOpen, setStartModalOpen] = useState(true)
  const [cacheFile, setCacheFile] = useState(null)
  const [machineState, setMachineState] = useState(null)
  const [navState, setNavState] = useState(initialNav)
  const [isSavingCache, setIsSavingCache] = useState(false)


  const loadCache = (path) => {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) return console.log(err);
      console.log(data);
      const c = JSON.parse(data)
      console.log(c);
      setMachineState(c)
      setTimeout(() => {
        if (c.machineAddress) {
          showManage()
        } else {
          showUpload()
        }
      }, 100)
    });
  }

  const saveMachineState = (machineState, fPath) => {
    if (!fPath & !cacheFile) {
      // make directory ./cache if it doesnt exist
      if (!fs.existsSync(CACHE_PATH)) {
        fs.mkdirSync(CACHE_PATH);
      }
      // create a new file
      if (machineState?.cluster && machineState?.cluster?.length > 0) {
        const fileName = `${machineState.cluster}-${machineState.cacheName}.json`
        const filePath = path.join(CACHE_PATH, fileName)
        setCacheFile(filePath)
        saveMachineState(machineState, filePath)
        return
      }
    }
    let filePath = fPath ? fPath : cacheFile
    setIsSavingCache(true)
    const saveDate = new Date()
    machineState.lastSave = saveDate
    fs.writeFile(filePath, JSON.stringify(machineState), function (err) {
      if (err) return console.log(err);
      console.log('machine state saved');
      setMachineState(machineState)
      setIsSavingCache(false)
      setTimeout(() => {
        console.log("new machine state:", machineState)
      }, 1000)
    });
  }

  const showUpload = () => {
    const newNavState = navState.map(n => {
      if (n.name === 'Create') {
        return { ...n, current: true }
      }
      return { ...n, current: false }
    })
    setNavState(newNavState)
  }

  const showManage = () => {
    const newNavState = navState.map(n => {
      if (n.name === 'Manage') {
        return { ...n, current: true, disabled: false }
      }
      if (n.name === 'Create') {
        return { ...n, current: false, disabled: true }
      }
      if (n.name === 'Mint') {
        return { ...n, current: false, disabled: false }
      }
    })
    setNavState(newNavState)
  }

  const showMint = () => {
    const newNavState = navState.map(n => {
      if (n.name === 'Mint') {
        return { ...n, current: true }
      }
      return { ...n, current: false }
    })
    setNavState(newNavState)
  }


  const mainContent = () => {
    if (navState[0].current) {
      return <UploadView machineState={machineState} saveMachineState={saveMachineState} showManage={showManage} />
    } else if (navState[1].current) {
      return <ManageView machineState={machineState} saveMachineState={saveMachineState} />
    } else if (navState[2].current) {
      return <MintView machineState={machineState} saveMachineState={saveMachineState} />
    } else {
      return <div></div>
    }
  }

  const deriveConnectedWallet = () => {
    if (machineState?.pubKeyPath) {
      const walletKeyPair = loadWalletKey(machineState?.pubKeyPath);
      const s = walletKeyPair?.publicKey?.toBase58();
      const s2 = s?.substring(0, 6) + '...' + s?.substring(s?.length - 6, s?.length)
      return s2
    }
    return ""
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <StartModal open={startModalOpen}
        setOpen={setStartModalOpen}
        newSelected={() => {
          showUpload()
          setMachineState({})
        }} fromCacheSelected={(cachePath) => {
          console.log("fromCacheSelected", cachePath)
          setStartModalOpen(false)
          setCacheFile(cachePath)
          loadCache(cachePath)
        }}
      />
      <div className="hidden bg-blue-700 md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">

              <div className="flex-shrink-0 flex items-center px-4">
                <img
                  className="h-20 w-auto"
                  src="/mintUILogo.png"
                  alt="Workflow"
                />
              </div>
              {machineState &&
                <div>
                  <div className="px-4 text-white text-sm mt-6">
                    Cache file: {cacheFile && <span className="font-medium">{cacheFile}</span>}
                  </div>
                  <div className="px-4 text-white text-sm">
                    Connected wallet: {deriveConnectedWallet() && <span className="font-medium">{deriveConnectedWallet()}</span>}
                  </div>
                </div>
              }
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navState.map((item) => (
                  <button
                    key={item.name}
                    disabled={item.disabled}
                    onClick={() => {
                      if (item.name === 'Manage') {
                        showManage()
                      } else if (item.name === 'Mint') {
                        showMint()
                      } else if (item.name === 'Create') {
                        if (item.current == false) {
                          setStartModalOpen(true)
                        }
                        showUpload()
                      }
                    }}
                    className={classNames(
                      item.current ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-600 hover:bg-opacity-75',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full', item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                    )}
                  >
                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6 text-blue-300" aria-hidden="true" />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  {/* <div>
                    <RefreshIcon
                      className="inline-block h-9 w-9 rounded-full text-white"
                    />
                  </div> */}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{!machineState?.cacheName ? "Cache not loaded" : isSavingCache ? "Saving Cache" : "Cache Saved"}</p>
                    <p className="text-xs font-medium text-blue-200">{machineState?.lastSave ? `Progress saved to ${cacheFile} at ${machineState.lastSave}` : ``}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          {mainContent()}
        </main>
      </div>
    </div >
  )
}