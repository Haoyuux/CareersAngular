// token-store.ts
export class TokenStorage {
  private static accessToken: string | null = null;
  private static refreshToken: string | null = null;
  private static user: any | null = null;

  static setAuthData(data: {
    userToken: string;
    newRefreshToken?: string;
    userID: string;
    userName: string;
    userRole: string[];
  }) {
    this.accessToken = data.userToken;
    this.refreshToken = data.newRefreshToken || null;
    this.user = {
      id: data.userID,
      userName: data.userName,
      roles: data.userRole || [],
    };
  }

  static clear() {
    this.accessToken = this.refreshToken = null;
    this.user = null;
  }
  static getAccessToken() {
    return this.accessToken;
  }
  static getRefreshToken() {
    return this.refreshToken;
  }
  static getUser() {
    return this.user;
  }
}
