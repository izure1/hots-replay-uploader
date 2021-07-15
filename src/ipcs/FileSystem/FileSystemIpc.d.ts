declare namespace FSIpc {
  interface OpenDirectorySuccess extends CommonIpc.EventSuccessState { path: string }
  interface OpenDirectoryFail extends CommonIpc.EventFailState {}
}