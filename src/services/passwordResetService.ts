import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { connectDB } from '@/lib/db';
import User from '@/models/main/User';
import { sendEmail } from '@/lib/email';
import { getPasswordResetTemplate, getPasswordResetSuccessTemplate } from '@/templates/emailTemplates';

export class PasswordResetService {
  /**
   * Generate a password reset token and send email
   */
  static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      await connectDB();

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Don't reveal if user exists or not for security
        return { success: true, message: 'If an account with that email exists, a password reset link has been sent.' };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save token to user
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();

      // Create reset URL
      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

      // Send email
      const { html, text } = getPasswordResetTemplate(resetUrl, user.name || 'User');
      
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request - Bedaya',
        html,
        text,
      });

      return { success: true, message: 'If an account with that email exists, a password reset link has been sent.' };
    } catch (error) {
      console.error('Password reset request error:', error);
      throw new Error('Failed to process password reset request');
    }
  }

  /**
   * Verify reset token and get user
   */
  static async verifyResetToken(token: string): Promise<{ valid: boolean; user?: any; message: string }> {
    try {
      await connectDB();

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return { valid: false, message: 'Invalid or expired reset token' };
      }

      return { valid: true, user, message: 'Token is valid' };
    } catch (error) {
      console.error('Token verification error:', error);
      throw new Error('Failed to verify reset token');
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      await connectDB();

      // Verify token and get user
      const { valid, user, message } = await this.verifyResetToken(token);
      
      if (!valid || !user) {
        return { success: false, message };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update user password and clear reset token
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      // Send success email
      const { html, text } = getPasswordResetSuccessTemplate(user.name || 'User');
      
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Successful - Bedaya',
        html,
        text,
      });

      return { success: true, message: 'Password has been reset successfully' };
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error('Failed to reset password');
    }
  }

  /**
   * Clean up expired reset tokens
   */
  static async cleanupExpiredTokens(): Promise<void> {
    try {
      await connectDB();
      
      await User.updateMany(
        { resetPasswordExpires: { $lt: new Date() } },
        { 
          $unset: { 
            resetPasswordToken: 1, 
            resetPasswordExpires: 1 
          } 
        }
      );
    } catch (error) {
      console.error('Cleanup expired tokens error:', error);
    }
  }
} 