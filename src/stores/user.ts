import { defineStore } from 'pinia'
import { requestToken } from '@/utils/auth.ts'

function randomString() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const randomArray = crypto.getRandomValues(new Uint8Array(128));

  return Array.from(randomArray).map(number => chars[number % chars.length]).join('');
}

export const useAuthStore = defineStore("auth", {
  persist: true,
  state: () => {
    return {
      codeVerifier: '',
      accessToken: '',
      refreshToken: '',
      expiresIn: -1,
      tokenType: '',
    }
  },
  getters: {
    user() {
      // todo
    }
  },
  actions: {
    async challenge() {
      this.codeVerifier = randomString();

      return await self.crypto.subtle.digest('SHA-256', new TextEncoder().encode(this.codeVerifier))
        .then((buf: ArrayBuffer) => Array.from(new Uint8Array(buf)))
        .then((u8: number[]) => String.fromCharCode.apply(null, u8))
        .then(btoa)
        .then((base64: string): string => base64
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, ''));
    },

    async login(code: string) {
      const rsp = await requestToken(code, this.codeVerifier)
      this.$reset();

      this.accessToken = rsp.access_token;
      this.refreshToken = rsp.refresh_token;
      this.expiresIn = rsp.expires_in;
      this.tokenType = rsp.token_type;
    },

    logout() {
      localStorage.removeItem('accessToken');
      this.$reset();
    }
  }
})
