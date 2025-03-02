import api from "@/utils/api";


class AuthensAPI {
  setAIKey() {
    throw new Error('Method not implemented.');
  }
  //POST
  async signIn(email: string, password: string) {
    return await api.post('/api/v1/authens/sign-in', {
      data: {
        email,
        password,
      },
    });
  }
}
export const authensAPI = new AuthensAPI();
