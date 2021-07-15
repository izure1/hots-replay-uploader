declare namespace AppIpc {
  import { ParserProcessReplayReturn } from 'hots-parser'

  interface UploadedReplays {
    path: string
    status: number
  }

  namespace ReplayComponent {
    interface ReplayUnique {
      matchID: string
    }
  }
  
  interface GetHotsDirectorySuccess extends CommonIpc.EventSuccessState { path: string }
  interface GetHotsDirectoryFail extends CommonIpc.EventFailState {}

  interface GetHotsReplaysSuccess extends CommonIpc.EventSuccessState { files: string[] }
  interface GetHotsReplaysFail extends CommonIpc.EventFailState {}

  interface ParseReplaySuccess extends CommonIpc.EventSuccessState { status: number, data: ParserProcessReplayReturn&ReplayComponent.ReplayUnique }
  interface ParseReplayFail extends CommonIpc.EventFailState { status: number }
}