declare interface Window {
  messaging: {
    send: (sendable: Sendable) => void;
    receive: (listener: (receivable: Receivable) => void) => () => void;
  };
}

import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
