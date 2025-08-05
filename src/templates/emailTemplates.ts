export const getPasswordResetTemplate = (resetUrl: string, userName: string) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Bedaya</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white !important;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 14px;
            }
            .warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>Bedaya Patient Management System</p>
        </div>
        
        <div class="content">
            <h2>Hello ${userName},</h2>
            
            <p>We received a request to reset your password for your Bedaya account. If you didn't make this request, you can safely ignore this email.</p>
            
            <p>To reset your password, click the button below:</p>
            
            <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                    <li>This link will expire in 1 hour</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Never share this link with anyone</li>
                </ul>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #10b981;">${resetUrl}</p>
            
            <p>Best regards,<br>The Bedaya Team (it's just me, <a href="https://iaboelsoud.com" target="_blank" rel="noopener noreferrer">Ibrahim aboelsoud</a> :) )</p>
        </div>
        
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; 2024 Bedaya Patient Management System. All rights reserved.</p>
        </div>
    </body>
    </html>
  `;

  const text = `
Password Reset Request - Bedaya Patient Management System

Hello ${userName},

We received a request to reset your password for your Bedaya account. If you didn't make this request, you can safely ignore this email.

To reset your password, visit this link:
${resetUrl}

Security Notice:
- This link will expire in 1 hour
- If you didn't request this reset, please ignore this email
- Never share this link with anyone

Best regards,
The Bedaya Team

This is an automated message, please do not reply to this email.
© 2024 Bedaya Patient Management System. All rights reserved.
  `;

  return { html, text };
};

export const getPasswordResetSuccessTemplate = (userName: string) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Successful - Bedaya</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }
            .success-box {
                background: #d4edda;
                border: 1px solid #c3e6cb;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>✅ Password Reset Successful</h1>
            <p>Bedaya Patient Management System</p>
        </div>
        
        <div class="content">
            <h2>Hello ${userName},</h2>
            
            <div class="success-box">
                <strong>Your password has been successfully reset!</strong>
            </div>
            
            <p>Your account password has been updated. You can now log in to your Bedaya account using your new password.</p>
            
            <p>If you didn't perform this action, please contact our support team immediately as your account may have been compromised.</p>
            
            <p>Best regards,<br>The Bedaya Team (it's just me, <a href="https://iaboelsoud.com" target="_blank" rel="noopener noreferrer">Ibrahim aboelsoud</a> :) )</p>
        </div>
    </body>
    </html>
  `;

  const text = `
Password Reset Successful - Bedaya Patient Management System

Hello ${userName},

Your password has been successfully reset!

Your account password has been updated. You can now log in to your Bedaya account using your new password.

If you didn't perform this action, please contact our support team immediately as your account may have been compromised.

Best regards,
The Bedaya Team
  `;

  return { html, text };
}; 