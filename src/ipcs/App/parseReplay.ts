import fs from 'fs-extra'
import hash from 'hash.js'
import { processReplay, ReplayStatus } from 'hots-parser'
import { ipcMain, IpcMainInvokeEvent } from 'electron'

export async function handler(e: IpcMainInvokeEvent, filepath: string): Promise<AppIpc.ParseReplaySuccess|AppIpc.ParseReplayFail> {
  if (!fs.existsSync(filepath) || !fs.lstatSync(filepath).isFile()) {
    return {
      success: false,
      name: 'ENOTEN',
      message: `'${filepath}'(은)는 파일이 아니거나, 위치에 없습니다.`,
      status: -7
    }
  }

  try {
    const data = processReplay(filepath)

    if (data.status !== ReplayStatus.OK) {
      return {
        success: false,
        name: `${data.status}`,
        message: '',
        status: data.status
      }
    }

    // 고유한 리플레이 핑거프린트를 생성하기 위해 컴포넌트 목록을 모읍니다.
    // 이 정보는 다른 플레이어의 리플레이와 동일한 결과값을 가지고 있어야 하며,
    // 다른 게임과 구분지을 수 있을 정도의 고유함을 가지고 있어야 합니다.
    const components = [
      data.match.version,
      data.match.mode,
      data.match.map,
      [...data.match.playerIDs].sort(),
      [...data.match.heroes].sort(),
      data.match.length,
      data.match.levelTimes
    ]
    const matchID = hash.sha256().update(JSON.stringify(components)).digest('hex')

    return {
      success: true,
      name: '',
      message: '',
      data: { ...data, matchID },
      status: data.status
    }
  }
  catch (reason) {
    const { name, message } = reason as Error
    console.error(reason)
    return {
      success: false,
      name,
      message,
      status: -8
    }
  }
}

export function ipc() {
  ipcMain.handle('parse-replay', async (e: IpcMainInvokeEvent, filepath: string) => {
    return await handler(e, filepath)
  })
}