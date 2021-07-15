<template>
  <v-app>
    <v-app-bar
      tile
      dense
      max-height="60"
      elevation="0"
    >
      <v-btn text @click="openReplayChanger">리플레이 폴더</v-btn>
      <v-btn text @click="openUploaderChanger">업로드 서버</v-btn>
      
      <v-badge
        :content="uploadedCount"
        :value="uploadedCount"
        color="warning"
        overlap
        dot
        offset-x="10"
        offset-y="15"
      >
        <v-btn text @click="openUploadedRelayList">기록</v-btn>
      </v-badge>

      <v-spacer />

      <v-btn
        icon
        small
        @click="windowMinimize"
      >
        <v-icon small>mdi-window-minimize</v-icon>
      </v-btn>

      <v-btn
        icon
        small
        class="mr-1"
        @click="windowClose"
      >
        <v-icon small>mdi-window-close</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-img src="@/assets/image/bg_app_dark.png"
        :height="500"
      >

        <v-container>
          <v-row>
            <v-col>
              <v-card
                tile
                flat
                :loading="isReplayFinding"
                :style="{ 'background-color': 'transparent' }"
              >

                <replay-uploader />
                
              </v-card>
            </v-col>
          </v-row>
        </v-container>

      </v-img>
    </v-main>


    <v-dialog v-model="isReplayChangerOpen">
      <directory-selector />
    </v-dialog>

    <v-dialog v-model="isUploaderChangerOpen">
      <endpoint-changer />
    </v-dialog>

    <v-dialog v-model="isUploadedReplayListOpen">
      <uploaded-replay-list />
    </v-dialog>
  </v-app>
</template>

<script lang="ts">
import { remote, BrowserWindow, App } from 'electron'
import { Vue, Component } from 'vue-property-decorator'

import DirectorySelector from './components/DirectorySelector.vue'
import EndpointChanger from './components/EndpointChanger.vue'
import ReplayUploader from './components/ReplayUploader.vue'
import UploadedReplayList from './components/UploadedReplayList.vue'

@Component({
  components: {
    DirectorySelector,
    EndpointChanger,
    ReplayUploader,
    UploadedReplayList
  }
})
export default class AppComponent extends Vue {
  private isReplayChangerOpen: boolean = false
  private isUploaderChangerOpen: boolean = false
  private isUploadedReplayListOpen: boolean = false

  private isReplayFinding: boolean = false

  private get uploadedCount(): number {
    return this.$store.state.uploadedCount
  }

  private get window(): BrowserWindow {
    return remote.getCurrentWindow()
  }

  private get app(): App {
    return remote.app
  }

  private openReplayChanger(): void {
    this.isReplayChangerOpen = true
  }

  private closeReplayChanger(): void {
    this.isReplayChangerOpen = false
  }

  private openUploaderChanger(): void {
    this.isUploaderChangerOpen = true
  }

  private closeUploaderChanger(): void {
    this.isUploaderChangerOpen = false
  }

  private openUploadedRelayList(): void {
    this.isUploadedReplayListOpen = true
    
    this.$store.dispatch('changeUploadedCount', 0)
  }

  private closeUploadedRelayList(): void {
    this.isUploadedReplayListOpen = false
  }

  private windowMinimize(): void {
    this.window.minimize()
  }

  private windowClose(): void {
    this.app.exit(0)
  }
}
</script>

<style lang="scss">
html,
body {
  overflow: hidden;
}

.v-app-bar {
  -webkit-app-region: drag;
}

.v-btn {
  -webkit-app-region: no-drag;
}

*::-webkit-scrollbar {
  width: 7px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 7px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
}

*:not(input):not(textarea) {
  user-select: none;
}
</style>
