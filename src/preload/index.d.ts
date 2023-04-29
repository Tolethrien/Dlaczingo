import { ElectronAPI } from "@electron-toolkit/preload"

//uncomment this API interface
// export interface API {}

declare global {
  interface Window {
    electron: ElectronAPI
    api: uknown // if you building your own API change this type to API
  }
}
