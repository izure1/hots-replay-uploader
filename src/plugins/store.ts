import os from 'os'
import path from 'path'
import Vue from 'vue'
import Vuex from 'vuex'

import DEFAULT_HOTS_DIRECTORY from '@/config/DEFAULT_HOTS_DIRECTORY'
import DEFAULT_UPLOAD_ENDPOINT from '@/config/DEFAULT_UPLOAD_ENDPOINT'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    cwd: localStorage.getItem('hots-directory') ?? DEFAULT_HOTS_DIRECTORY,
    uploadEndpoint: localStorage.getItem('upload-endpoint') ?? DEFAULT_UPLOAD_ENDPOINT,
    replays: [] as string[],
    uploadReplayQueue: '',
    uploadedReplays: [] as AppIpc.UploadedReplays[],
    uploadedCount: 0
  },
  mutations: {
    setCwd(state, cwd: string): void {
      if (!cwd) {
        cwd = DEFAULT_HOTS_DIRECTORY
      }
      state.cwd = cwd
    },
    setUploadEndpoint(state, endpoint: string): void {
      if (!endpoint) {
        endpoint = DEFAULT_UPLOAD_ENDPOINT
      }
      state.uploadEndpoint = endpoint
    },
    setReplays(state, replays: string[]): void {
      state.replays = replays
    },
    setUploadReplayQueue(state, replay: string): void {
      state.uploadReplayQueue = replay
    },
    setUploadedReplays(state, replays: AppIpc.UploadedReplays[]): void {
      state.uploadedReplays = replays
    },
    setUploadedCount(state, count: number): void {
      state.uploadedCount = count
    }
  },
  actions: {
    changeCwd({ commit }, cwd: string) {
      localStorage.setItem('hots-directory', cwd)
      commit('setCwd', cwd)
    },
    changeUploadEndpoint({ commit }, endpoint: string) {
      localStorage.setItem('upload-endpoint', endpoint)
      commit('setUploadEndpoint', endpoint)
    },

    changeReplays({ commit }, replays: string[]) {
      commit('setReplays', replays)
    },
    addReplay({ commit, state }, replay: string) {
      const replays = new Set(state.replays)
      replays.add(replay)
      commit('setReplays', Array.from(replays))
    },
    submitReplay({ commit, state }, replay: string) {
      const replays = new Set(state.replays)
      replays.delete(replay)
      commit('setReplays', Array.from(replays))
    },

    changeUploadReplayQueue({ commit }, replay: string) {
      commit('setUploadReplayQueue', replay)
    },

    changeUploadedReplays({ commit }, replays: AppIpc.UploadedReplays[]) {
      commit('setUploadedReplays', replays)
    },
    addUploadedReplay({ commit, state }, replay: AppIpc.UploadedReplays) {
      const replays = new Set(state.uploadedReplays)
      replays.add(replay)
      commit('setUploadedReplays', Array.from(replays))
    },
    submitUploadedReplay({ commit, state }, replay: string) {
      const replays = state.uploadedReplays.filter((uploadedReplay) => {
        return uploadedReplay.path !== replay
      })
      commit('setUploadedReplays', replays)
    },

    changeUploadedCount({ commit }, count: number) {
      commit('setUploadedCount', count)
    },
    addUploadedCount({ commit, state }, count: number) {
      commit('setUploadedCount', state.uploadedCount + count)
    },
    submitUploadedCount({ commit, state }, count: number) {
      let result = state.uploadedCount - count
      if (result < 0) {
        result = 0
      }
      commit('setUploadedCount', result)
    },
  },
  modules: {
  }
})
