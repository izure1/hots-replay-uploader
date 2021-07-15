import { dialog, ipcMain, IpcMainInvokeEvent, BrowserWindow } from 'electron'

export async function handler(): Promise<FSIpc.OpenDirectorySuccess|FSIpc.OpenDirectoryFail> {
  const win = BrowserWindow.getFocusedWindow()
  if (!win) {
    return {
      success: false,
      name: '디렉토리 열기 실패',
      message: '메인 윈도우가 없습니다'
    }
  }

  const directoryPaths = await dialog.showOpenDialog(win, {
    title: '디렉토리를 선택하세요',
    properties: ['openDirectory']
  })

  // 디렉토리를 선택하지 않았을 경우
  if (directoryPaths.canceled) {
    return {
      success: false,
      name: '디렉토리 열기 취소',
      message: '사용자가 작업을 취소했습니다'
    }
  }

  const directoryPath = directoryPaths.filePaths.pop()
  if (!directoryPath) {
    return {
      success: false,
      name: '디렉토리 열기 실패',
      message: '디렉토리를 선택해주세요'
    }
  }

  return {
    success: true,
    name: '',
    message: '',
    path: directoryPath
  }
}

export function ipc(): void {
  ipcMain.handle('open-directory', async (_e: IpcMainInvokeEvent) => {
    return await handler()
  })
}