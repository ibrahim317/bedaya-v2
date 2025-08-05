import { PasswordResetService } from '@/services/passwordResetService';

/**
 * Clean up expired password reset tokens
 * This function can be called periodically (e.g., via cron job) to clean up expired tokens
 */
export async function cleanupExpiredTokens() {
  try {
    console.log('Starting cleanup of expired password reset tokens...');
    await PasswordResetService.cleanupExpiredTokens();
    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// If this file is run directly (e.g., via cron job)
if (require.main === module) {
  cleanupExpiredTokens()
    .then(() => {
      console.log('Cleanup script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Cleanup script failed:', error);
      process.exit(1);
    });
} 