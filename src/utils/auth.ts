import axios from 'axios';
import { useAuthStore } from '@/stores/user.ts'

export const login = async () => {
  const state = String.fromCharCode.apply(null, Array.from(self.crypto.getRandomValues(new Uint8Array(40))));

  window.location.href = `${import.meta.env.VITE_API_URL}/oauth/authorize?` + new URLSearchParams({
    client_id: import.meta.env.VITE_CLIENT_ID,
    response_type: 'code',
    scope: '*',
    state: state,
    code_challenge: await useAuthStore().challenge(),
    code_challenge_method: 'S256',
    redirect_uri: 'http://localhost:5173/callback',
  });
}

export const requestToken = async (code: string, codeVerifier: string) => {
  const rsp = await axios.post(`${import.meta.env.VITE_API_URL}/oauth/token`, {
    grant_type: 'authorization_code',
    client_id: import.meta.env.VITE_CLIENT_ID,
    redirect_uri: 'http://localhost:5173/callback',
    code_verifier: codeVerifier,
    code: code,
  });

  return rsp.data
}
