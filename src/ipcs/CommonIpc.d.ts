declare namespace CommonIpc {
  interface EventState {
    success: boolean
    name: string
    message: string
  }
  
  interface EventSuccessState extends EventState {
    success: true
  }
  
  interface EventFailState extends EventState {
    success: false
  }
}