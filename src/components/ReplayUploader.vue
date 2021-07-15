<template>
  <section>
    <v-list v-if="replays.length"
      two-line
      :style="{ 'background-color': 'transparent' }"
    >
      <v-virtual-scroll
        :items="replays"
        item-height="60"
        height="380"
      >
        <template v-slot:default="{ item }">
          <v-list-item :key="`replay-${item}`">

            <v-list-item-avatar>
              <v-progress-circular v-if="isUploading(item) || isParsing(item)"
                :size="30"
                :width="2"
                color="primary"
                indeterminate
              />
              <v-icon v-else>mdi-upload-network</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="text-body-2">{{ getFilename(item) }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                {{ getQueueState(item) }}
              </v-list-item-subtitle>
            </v-list-item-content>

          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-list>

    <div v-else
      class="mt-16"
    >
      <div class="text-center">
        <h4 class="text-h4">히오스 리플레이 업로더</h4>
        <p class="text-overline">{{ uploadEndpoint }}</p>
        <p class="mt-5 mb-8 text-center text-overline">
          매 게임이 끝나고 생성된 리플레이를 위 서버로 자동 업로드합니다.
          <br>
          현재는 사용자지정 게임만 업로드됩니다.
        </p>
      </div>
      
      <div class="d-flex justify-center">
        <v-img src="@/assets/image/icon_256.png"
          class="ico-icon-256"
          :max-width="160"
          :max-height="160"
          @click="readyEasterEgg"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import path from 'path'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { ipcRenderer } from 'electron'
import axios from 'axios'
import anime from 'animejs'
import chokidar from 'chokidar'

import charNazeebo from '@/assets/image/char_nazeebo.png'
import sndNazeeboShit from '@/assets/audio/snd_nazeebo_shit.mp3'

@Component
export default class ReplayUploader extends Vue {
  private parseQueue: Promise<number>[] = []
  private currentParseTarget: string|null = null
  private currentUploadingTarget: string|null = null

  private replayWatcher: chokidar.FSWatcher|null = null

  private easterEggClickCount: number = 0

  private get replays(): string[] {
    return this.$store.state.replays
  }

  private get cwd(): string {
    return this.$store.state.cwd
  }

  @Watch('cwd', { immediate: true })
  private onChangeCwd(): void {
    this.unwatchReplayAdded()
    this.watchReplayAdded()
  }

  private get uploadReplayQueue(): string[] {
    return this.$store.state.uploadReplayQueue
  }

  @Watch('uploadReplayQueue')
  private onChangeUploadReplayQueue(): void {
    const uploadReplayQueue = this.$store.state.uploadReplayQueue
    if (uploadReplayQueue === '') {
      return
    }
    else {
      this.$store.state.uploadReplayQueue = ''
    }
    this.upload(uploadReplayQueue)
  }

  async upload(replay: string): Promise<void> {
    const lastQueue = this.parseQueue[this.parseQueue.length - 1] ?? null

    this.$store.dispatch('addReplay', replay)
    this.$store.dispatch('addUploadedCount', 1)

    await this.$nextTick()

    // eslint-disable-next-line no-async-promise-executor
    const promise = new Promise<number>(async (resolve, reject) => {
      if (lastQueue !== null) {
        try {
          await lastQueue
        // eslint-disable-next-line no-empty
        } catch (reason) {}
      }

      const result = await this.parseAndUploadReplay(replay)

      await this.$nextTick()

      if (result === 1) {
        resolve(result)
      }
      else {
        reject(result)
      }

      this.$store.dispatch('addUploadedReplay', { path: replay, status: result })
      this.$store.dispatch('submitReplay', replay)
    })

    this.parseQueue.push(promise)
  }

  private watchReplayAdded(): void {
    this.replayWatcher = chokidar.watch('**/*.StormReplay', { cwd: this.cwd, ignoreInitial: true, interval: 1000 })
    this.replayWatcher.on('add', async (replay) => {
      this.$store.dispatch('changeUploadReplayQueue', path.resolve(this.cwd, replay))
    })
  }

  private unwatchReplayAdded(): void {
    if (this.replayWatcher) {
      this.replayWatcher.close()
    }
    this.replayWatcher = null
  }

  private get uploadEndpoint(): string {
    return this.$store.state.uploadEndpoint
  }

  private getFilename(filepath: string): string {
    return path.parse(filepath).name
  }

  private isUploading(filename: string): boolean {
    return this.currentUploadingTarget === filename
  }

  private isParsing(filename: string): boolean {
    return this.currentParseTarget === filename
  }

  private getQueueState(filename: string): string {
    if (this.isParsing(filename)) {
      return '해석 중...'
    }
    else if (this.isUploading(filename)) {
      return '업로드 중...'
    }
    else {
      return '대기 중...'
    }
  }

  private async parseReplay(filename: string): Promise<AppIpc.ParseReplaySuccess|AppIpc.ParseReplayFail> {
    this.currentParseTarget = filename

    const replayParse: AppIpc.ParseReplaySuccess|AppIpc.ParseReplayFail = await ipcRenderer.invoke('parse-replay', filename)

    this.currentParseTarget = null

    return replayParse
  }

  private async parseAndUploadReplay(filename: string): Promise<number> {
    const parseResult = await this.parseReplay(filename)

    console.log(parseResult)
    if (!parseResult.success || parseResult.status !== 1) {
      // 해석에 실패했다면 
      return parseResult.status
    }

    // 사용자 지정 게임이 아닌 경우
    if (parseResult.success && parseResult.data.match.mode !== -1) {
      return -10
    }

    this.currentUploadingTarget = filename

    return axios
      .post(this.uploadEndpoint, parseResult.data)
      .then(({ status }) => {
        if (status >= 200 && status < 300) {
          // 리플레이 목록에서 완료된 파일을 제외합니다
          this.$store.dispatch('submitReplay', filename)
          return 1
        }
        return -9
      })
      .catch(() => {
        // 실패했다면 파일을 제외하지 않습니다.
        return -9
      })
      .finally(() => {
        this.currentUploadingTarget = null
        this.$store.dispatch('addUploadedCount', 1)
      })
  }

  private readyEasterEgg(): void {
    this.easterEggClickCount++

    if ((this.easterEggClickCount % 5) === 0) {
      const image = new Image()

      image.src = charNazeebo
      image.style.zIndex = '1'
      image.style.position = 'fixed'
      image.style.left = '0px'
      image.style.top = '0px'
      image.style.pointerEvents = 'none'
      image.onload = () => {
        document.body.append(image)
        anime({
          targets: image,
          translateX: [180, 180],
          translateY: [0, 0],
          scale: [0, 5],
          opacity: [1, 0],
          duration: 3500,
          begin: () => {
            // 뚜르보작!
            new Audio(sndNazeeboShit).play()
          },
          complete: () => {
            image.remove()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
@keyframes rotateicon {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
}

.ico-icon-256 {
  animation: 6s infinite linear rotateicon;
}
</style>