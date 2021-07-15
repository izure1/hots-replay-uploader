import glob from 'fast-glob'
import { ipcMain, IpcMainInvokeEvent } from 'electron'

export async function handler(e: IpcMainInvokeEvent, cwd: string): Promise<AppIpc.GetHotsReplaysSuccess|AppIpc.GetHotsReplaysFail> {
  try {
    const globs = await glob('**/*.StormReplay', { cwd, onlyFiles: true, absolute: true })

    return {
      success: true,
      name: '',
      message: '',
      files: globs as string[]
    }
  } catch (reason) {
    const { name, message } = reason as Error
    return {
      success: false,
      name,
      message
    }
  }
}

export function ipc() {
  ipcMain.handle('get-hots-replays', async (e: IpcMainInvokeEvent, cwd: string) => {
    return await handler(e, cwd)
  })
}