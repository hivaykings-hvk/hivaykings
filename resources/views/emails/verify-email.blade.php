<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your HVK Account</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #374151;">
    <div class="container" style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
      <!-- Header -->
      <div class="header" style="background: #ffd54f; padding: 30px 20px; text-align: center; color: #000000;">
        <h1 style="margin: 0; padding: 20px 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; text-align: center;">Welcome to HVK 👋</h1>
        <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9; text-align: center;">Let’s get your account ready to go!</p>
      </div>

      <!-- Body -->
      <div class="body" style="padding: 30px 25px; text-align: center;">
        <h2 style="font-size: 22px; margin-bottom: 10px; color: #111827;">🔓 Let’s Unlock Your Account!</h2>
        <p style="font-size: 16px; line-height: 1.6; margin: 10px 0 25px; color: #111827;">
          You're just one click away from joining the HVK community — let’s make
          it official!
        </p>

        <a href="{{ $verificationUrl }}" class="verify-btn" style="display: inline-block; background: #ffd54f; color: #000000; text-decoration: none; padding: 5px 10px; border-radius: 8px; font-weight: 600; font-size: 16px;">Verify My Email</a>

        <p style="margin-top: 25px; font-size: 14px; color: #6b7280">
          If the button above doesn’t work, copy and paste this link into your
          browser:
        </p>
        <div class="link-box" style="background: #f3f4f6; padding: 12px; font-size: 14px; word-break: break-all; border-radius: 8px; margin-top: 20px; text-align: left;">
          <a href="{{ $verificationUrl }}" style="color: #ca8a04;">{{ $verificationUrl }}</a>
        </div>

        <p style="margin-top: 25px; font-size: 14px; color: #6b7280">
          This link will expire in 24 hours. If you didn’t sign up for HVK, you
          can safely ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer" style="text-align: center; padding: 20px; font-size: 13px; color: #9ca3af;">
        <p>© {{ date('Y') }} HVK. All rights reserved.</p>
        <p>
          <a href="https://hvk.co.in/terms" style="color: #6b7280; text-decoration: none;">Terms</a> •
          <a href="https://hvk.co.in/privacy" style="color: #6b7280; text-decoration: none;">Privacy</a>
        </p>
      </div>
    </div>
  </body>
</html>
