# ENDGAME

## Password reset email

The backend sends password reset emails through Gmail SMTP. Create a Google
App Password for the Gmail account that will send the emails (2-Step
Verification must be enabled), then add these settings to `backend/.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-sender@gmail.com
EMAIL_HOST_PASSWORD=your-16-character-google-app-password
DEFAULT_FROM_EMAIL=your-sender@gmail.com
FRONTEND_URL=http://localhost:5173
```

Do not use your regular Google account password. Keep the app password private
and restart the Django server after updating `backend/.env`.
