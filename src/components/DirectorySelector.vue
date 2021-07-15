<template>
  <v-card>
    <v-card-title>히오스 리플레이 폴더 선택</v-card-title>
    <v-card-subtitle>히오스 폴더를 관리합니다.</v-card-subtitle>

    <v-card-text class="text-center">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            v-on="on"
            @click="selectDirectory"
          >
            {{ cwd || '히오스 리플레이 폴더를 찾지 못함' }}
          </v-btn>
        </template>
        <span>클릭하여 직접 선택</span>
      </v-tooltip>
    </v-card-text>

    <v-divider />

    <v-card-actions class="justify-center">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            left
            v-on="on"
            @click="selectDirectoryAutomatic"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>자동으로 검색을 시도합니다</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import fs from 'fs-extra'
import { ipcRenderer } from 'electron'

import { Vue, Component } from 'vue-property-decorator'

@Component
export default class DirectorySelector extends Vue {
  private get cwd(): string {
    return this.$store.state.cwd
  }

  private set cwd(v: string) {
    this.$store.dispatch('changeCwd', v)
  }

  private async getDirectoryAutomatic(): Promise<string> {
    const hotsDirectoryGet: AppIpc.GetHotsDirectorySuccess|AppIpc.GetHotsDirectoryFail = await ipcRenderer.invoke('get-hots-directory')
    return hotsDirectoryGet.success ? hotsDirectoryGet.path : ''
  }

  private async getDirectory(): Promise<string> {
    // 저장된 데이터로부터 읽어오기
    let cwd = this.$store.state.cwd

    // 저장된 데이터가 없거나 잘못되었다면 자동으로 찾아오기
    if (!this.isDirectoryExists(cwd)) {
      cwd = await this.getDirectoryAutomatic()
    }

    return cwd
  }

  private isDirectoryExists(directoryPath: string): boolean {
    return fs.existsSync(directoryPath) && fs.lstatSync(directoryPath).isDirectory()
  }

  private async selectDirectory(): Promise<void> {
    const directoryOpen: FSIpc.OpenDirectorySuccess|FSIpc.OpenDirectoryFail = await ipcRenderer.invoke('open-directory')
    if (!directoryOpen.success) {
      return
    }
    this.cwd = directoryOpen.path
  }

  private async selectDirectoryAutomatic(): Promise<void> {
    this.cwd = await this.getDirectoryAutomatic()
  }

  async created() {
    this.cwd = await this.getDirectory()
  }
}
</script>