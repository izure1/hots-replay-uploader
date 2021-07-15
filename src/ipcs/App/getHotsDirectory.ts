import fs from 'fs-extra'
import { ipcMain, IpcMainInvokeEvent } from 'electron'
import DEFAULT_HOTS_DIRECTORY from '@/config/DEFAULT_HOTS_DIRECTORY'

export async function handler(e: IpcMainInvokeEvent): Promise<AppIpc.GetHotsDirectorySuccess|AppIpc.GetHotsDirectoryFail> {
  const cwd = DEFAULT_HOTS_DIRECTORY

  if (fs.existsSync(cwd) && fs.lstatSync(cwd).isDirectory()) {
    return {
      success: true,
      name: '',
      message: '',
      path: cwd
    }
  }

  return {
    success: false,
    name: '폴더 찾지 못함',
    message: 'Heroes of the Storm 폴더를 찾지 못했습니다'
  }
}

export function ipc() {
  ipcMain.handle('get-hots-directory', async (e: IpcMainInvokeEvent) => {
    return await handler(e)
  })
}