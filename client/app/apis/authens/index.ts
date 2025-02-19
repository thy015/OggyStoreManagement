import api from '@/app/utils/api';

class AuthensAPI {
  async signIn(email: string, password: string) {
    return await api.post('/authens/sign-in', {
      data: {
        email,
        password,
      },
    });
  }
}
export const authensAPI = new AuthensAPI();
