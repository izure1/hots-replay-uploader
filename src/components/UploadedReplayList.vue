<template>
  <v-card>

    <v-card-title>리플레이 업로드 결과</v-card-title>
    <v-card-subtitle>리플레이 업로드 결과입니다.</v-card-subtitle>

    <v-card-text>
      <v-list v-if="uploadedReplays.length"
        two-line
      >
        <v-list-item v-for="replay in uploadedReplays"
          :key="`uploaded-replay-${replay.path}`"
        >
          <v-list-item-action>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  small
                  v-on="on"
                  @click="dropUploadedReplay(replay.path)"
                >
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
              </template>
              <span>목록에서 제거합니다</span>
            </v-tooltip>

            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  small
                  v-on="on"
                  @click="retryUploadReplay(replay.path)"
                >
                  <v-icon small>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>재업로드를 시도합니다</span>
            </v-tooltip>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title class="text-body-2">{{ getFilename(replay.path) }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">{{ getResultState(replay.status) }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <div v-else>
        <p class="text-center my-10">
          목록이 없습니다.
        </p>
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions class="justify-center">
      <v-btn text @click="clearUploadedReplays">모두 지우기</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script lang="ts">
import path from 'path'
import fs from 'fs-extra'
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class UploadedReplayList extends Vue {
  private get uploadedReplays(): AppIpc.UploadedReplays[] {
    return this.$store.state.uploadedReplays
  }

  private getFilename(filepath: string): string {
    return path.parse(filepath).name
  }

  private dropUploadedReplay(filepath: string): void {
    this.$store.dispatch('submitUploadedReplay', filepath)
  }

  private retryUploadReplay(filepath: string): void {
    this.$store.dispatch('submitUploadedReplay', filepath)

    // 리플레이 파일이 삭제되었거나, 더 이상 존재하지 않을 경우
    if (!(fs.existsSync(filepath) && fs.lstatSync(filepath).isFile())) {
      return
    }

    this.$store.dispatch('changeUploadReplayQueue', filepath)
  }

  private clearUploadedReplays(): void {
    this.$store.dispatch('changeUploadedReplays', [])
  }

  private getResultState(status: number): string {
    switch (status) {
      case 1: return '성공'
      case 0: return '지원되지 않음'
      case -1: return ''
      case -2: return '알 수 없는 오류'
      case -3: return '지원되지 않는 지도'
      case -4: return '인공지능, 협동전은 지원되지 않음'
      case -5: return '미완료된 게임 오류. 리플레이가 완전하지 않음'
      case -6: return '너무 오래된 리플레이'
      case -7: return '파일이 아니거나 올바른 위치에 있지 않음'
      case -8: return 'IPC에서 알 수 없는 오류가 발생'
      case -9: return '업로드에 실패함'
      case -10: return '사용자 지정 게임이 아님'
      
      default: return '알 수 없는 상태 코드'
    }
  }
}
</script>