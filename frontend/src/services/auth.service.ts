import api from './api';

export interface LoginDto {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt?: string;
  twoFactorEnabled?: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
}

const notifyUserUpdated = () => {
  window.dispatchEvent(new Event('auth:userUpdated'));
};

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<{
      code: number;
      message: string;
      data: { token?: string; accessToken?: string; refreshToken?: string; user: User };
    }>('/auth/login', data);

    const { data: payload } = response.data;

    const authData: AuthResponse = {
      access_token: payload.accessToken || payload.token || '',
      refresh_token: payload.refreshToken,
      user: payload.user,
    };

    localStorage.setItem('token', authData.access_token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    notifyUserUpdated();

    return authData;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<{
      code: number;
      message: string;
      data: { token?: string; accessToken?: string; refreshToken?: string; user: User };
    }>('/auth/register', data);

    const { data: payload } = response.data;

    const authData: AuthResponse = {
      access_token: payload.accessToken || payload.token || '',
      refresh_token: payload.refreshToken,
      user: payload.user,
    };

    localStorage.setItem('token', authData.access_token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    notifyUserUpdated();

    return authData;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<{
      code: number;
      data: User;
    }>('/auth/me');
    const user = response.data.data;
    localStorage.setItem('user', JSON.stringify(user));
    notifyUserUpdated();
    return user;
  },

  async updateProfile(data: Partial<Pick<User, 'name' | 'email' | 'avatar'>>): Promise<User> {
    const response = await api.patch<{
      code: number;
      message: string;
      data: User;
    }>('/users/me', data);

    const user = response.data.data;
    localStorage.setItem('user', JSON.stringify(user));
    notifyUserUpdated();
    return user;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post<{
      code: number;
      message: string;
    }>('/auth/change-password', { currentPassword, newPassword });
  },

  async setTwoFactorEnabled(enabled: boolean): Promise<boolean> {
    const response = await api.patch<{
      code: number;
      message: string;
      data: { twoFactorEnabled: boolean };
    }>('/users/me/2fa', { enabled });

    const current = authService.getCurrentUser();
    if (current) {
      const nextUser: User = { ...current, twoFactorEnabled: response.data.data.twoFactorEnabled };
      localStorage.setItem('user', JSON.stringify(nextUser));
      notifyUserUpdated();
    }

    return response.data.data.twoFactorEnabled;
  },

  async setupTwoFactor(): Promise<{ secret: string; otpauthUrl: string }> {
    const response = await api.post<{
      code: number;
      message: string;
      data: { secret: string; otpauthUrl: string };
    }>('/auth/2fa/setup');
    return response.data.data;
  },

  async verifyTwoFactor(code: string): Promise<boolean> {
    const response = await api.post<{
      code: number;
      message: string;
      data: { twoFactorEnabled: boolean };
    }>('/auth/2fa/verify', { code });

    const current = authService.getCurrentUser();
    if (current) {
      const nextUser: User = { ...current, twoFactorEnabled: response.data.data.twoFactorEnabled };
      localStorage.setItem('user', JSON.stringify(nextUser));
      notifyUserUpdated();
    }

    return response.data.data.twoFactorEnabled;
  },

  async disableTwoFactor(code: string): Promise<boolean> {
    const response = await api.post<{
      code: number;
      message: string;
      data: { twoFactorEnabled: boolean };
    }>('/auth/2fa/disable', { code });

    const current = authService.getCurrentUser();
    if (current) {
      const nextUser: User = { ...current, twoFactorEnabled: response.data.data.twoFactorEnabled };
      localStorage.setItem('user', JSON.stringify(nextUser));
      notifyUserUpdated();
    }

    return response.data.data.twoFactorEnabled;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    notifyUserUpdated();
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};
