import { fetchJson } from './base';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

export interface TokenVerificationResponse {
  valid: boolean;
  message: string;
  user?: any;
}

export const passwordResetClient = {
  /**
   * Request a password reset email
   */
  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    return fetchJson('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Verify a reset token
   */
  async verifyResetToken(token: string): Promise<TokenVerificationResponse> {
    return fetchJson(`/api/auth/reset-password?token=${token}`, {
      method: 'GET',
    });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<PasswordResetResponse> {
    return fetchJson('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },
}; 