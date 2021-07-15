<template>
  <v-card>
    <v-card-title>결과 업로드 주소</v-card-title>
    <v-card-subtitle>리플레이 결과를 업로드 할 서버 주소를 관리합니다.</v-card-subtitle>

    <v-card-text class="text-center">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            v-on="on"
            @click="openForm"
          >
            {{ endpoint || '결과 업로드 주소를 찾지 못함' }}
          </v-btn>
        </template>
        <span>클릭하여 직접 수정</span>
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
            @click="selectEndpointAutomatic"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>기본값으로 변경합니다</span>
      </v-tooltip>
    </v-card-actions>

    <v-dialog v-model="isFormOpen"
      persistent
    >
      <v-card>
        <v-card-title>결과 업로드 주소 입력</v-card-title>
        <v-card-subtitle>
          리플레이 결과를 업로드할 주소를 직접 입력합니다. 기본값은 {{ defaultEndpoint }} 입니다.
        </v-card-subtitle>
        <v-card-text>
          <v-text-field type="text"
            :placeholder="endpoint"
            v-model="endpointCache"
            rounded
            filled
            clearable
            @input="changeEndpointCache"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="justify-center">
          <v-btn text :disabled="!isGoodEndpoint(endpointCache)" @click="save">저장</v-btn>
          <v-btn text @click="closeForm">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import DEFAULT_UPLOAD_ENDPOINT from '@/config/DEFAULT_UPLOAD_ENDPOINT'

@Component
export default class DirectorySelector extends Vue {
  private isFormOpen: boolean = false
  private endpointCache: string = ''

  private get endpoint(): string {
    return this.$store.state.uploadEndpoint
  }

  private set endpoint(v: string) {
    this.$store.dispatch('changeUploadEndpoint', v)
  }

  private isGoodEndpoint(v: string): boolean {
    const regex = /^https?:\/\/(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/g
    return regex.test(v)
  }

  private changeEndpointCache(v: string): void {
    this.endpointCache = v
  }

  private get defaultEndpoint(): string {
    return DEFAULT_UPLOAD_ENDPOINT
  }

  private async getEndpoint(): Promise<string> {
    // 저장된 데이터로부터 읽어오기
    let endpoint = this.endpoint

    // 저장된 데이터가 없거나 잘못된 주소라면 자동으로 찾아오기
    if (!this.isGoodEndpoint(endpoint)) {
      endpoint = this.defaultEndpoint
    }

    return endpoint
  }

  private openForm(): void {
    this.isFormOpen = true
    this.endpointCache = this.endpoint
  }

  private closeForm(): void {
    this.isFormOpen = false
  }

  private save(): void {
    this.endpoint = this.endpointCache
    this.closeForm()
  }

  private async selectEndpointAutomatic(): Promise<void> {
    this.endpoint = this.defaultEndpoint
  }

  async created() {
    this.endpoint = await this.getEndpoint()
  }
}
</script>