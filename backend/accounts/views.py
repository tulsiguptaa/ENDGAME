import os
import logging
import requests
import smtplib

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth.tokens import default_token_generator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import SignupSerializer


logger = logging.getLogger(__name__)

# =========================================================
# SIGNUP
# =========================================================

class SignupView(APIView):

    def post(self, request):

        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():

            user = serializer.save()

            return Response(
                {
                    "message": "Account created successfully.",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# LOGIN
# =========================================================

class LoginView(APIView):

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:

            return Response(
                {
                    "error": "Username and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is None:

            return Response(
                {
                    "error": "Invalid username or password."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        login(request, user)

        return Response(
            {
                "message": "Login successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                }
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# LOGOUT
# =========================================================

class LogoutView(APIView):

    def post(self, request):

        logout(request)

        return Response(
            {
                "message": "Logged out successfully."
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# CURRENT USER
# =========================================================

class CurrentUserView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        )


# =========================================================
# GOOGLE LOGIN
# =========================================================

class GoogleLoginView(APIView):

    def get(self, request):

        client_id = os.getenv("GOOGLE_CLIENT_ID")

        if not client_id:

            return Response(
                {
                    "error": "GOOGLE_CLIENT_ID is not configured."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        redirect_uri = (
            "http://127.0.0.1:8000"
            "/api/auth/google/callback/"
        )

        google_auth_url = (
            "https://accounts.google.com/o/oauth2/v2/auth"
            f"?client_id={client_id}"
            f"&redirect_uri={redirect_uri}"
            "&response_type=code"
            "&scope=openid%20email%20profile"
            "&access_type=offline"
        )

        return redirect(google_auth_url)


# =========================================================
# GOOGLE CALLBACK
# =========================================================

class GoogleCallbackView(APIView):

    def get(self, request):

        code = request.GET.get("code")

        if not code:

            return Response(
                {
                    "error":
                    "Google authorization code is missing."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        client_id = os.getenv(
            "GOOGLE_CLIENT_ID"
        )

        client_secret = os.getenv(
            "GOOGLE_CLIENT_SECRET"
        )

        if not client_id or not client_secret:

            return Response(
                {
                    "error":
                    "Google OAuth credentials are not configured."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        redirect_uri = (
            "http://127.0.0.1:8000"
            "/api/auth/google/callback/"
        )

        # -------------------------------------------------
        # Exchange Google authorization code for token
        # -------------------------------------------------

        token_response = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": client_id,
                "client_secret": client_secret,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            },
            timeout=10
        )

        if token_response.status_code != 200:

            return Response(
                {
                    "error":
                    "Failed to exchange Google authorization code.",
                    "details": token_response.json()
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        token_data = token_response.json()

        access_token = token_data.get(
            "access_token"
        )

        if not access_token:

            return Response(
                {
                    "error":
                    "Google access token was not received."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Get Google user information
        # -------------------------------------------------

        user_response = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={
                "Authorization":
                f"Bearer {access_token}"
            },
            timeout=10
        )

        if user_response.status_code != 200:

            return Response(
                {
                    "error":
                    "Failed to retrieve Google user information."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        google_user = user_response.json()

        google_id = google_user.get("id")
        email = google_user.get("email")
        name = google_user.get("name", "")

        if not email:

            return Response(
                {
                    "error":
                    "Google account email was not provided."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Find existing user
        # -------------------------------------------------

        user = User.objects.filter(
            email=email
        ).first()

        # -------------------------------------------------
        # Create user if doesn't exist
        # -------------------------------------------------

        if user is None:

            base_username = email.split("@")[0]

            username = base_username
            counter = 1

            while User.objects.filter(
                username=username
            ).exists():

                username = (
                    f"{base_username}{counter}"
                )

                counter += 1

            user = User.objects.create_user(
                username=username,
                email=email
            )

            # Save Google name
            if name:

                name_parts = name.split(
                    " ",
                    1
                )

                user.first_name = name_parts[0]

                if len(name_parts) > 1:

                    user.last_name = (
                        name_parts[1]
                    )

            user.save()

        # -------------------------------------------------
        # Create Django session
        # -------------------------------------------------

        login(request, user)

        # -------------------------------------------------
        # Redirect to React
        # -------------------------------------------------

        return redirect(
            "http://localhost:5173/dashboard"
        )



class GitHubLoginView(APIView):

    def get(self, request):

        client_id = os.getenv("GITHUB_CLIENT_ID")

        if not client_id:
            return Response(
                {
                    "error": "GitHub Client ID is not configured."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        redirect_uri = (
            "http://127.0.0.1:8000/api/auth/github/callback/"
            
        )

        github_url = (
            "https://github.com/login/oauth/authorize"
            f"?client_id={client_id}"
            f"&redirect_uri={redirect_uri}"
            "&scope=user:email"
        )

        return redirect(github_url)


class GitHubCallbackView(APIView):

    def get(self, request):

        code = request.GET.get("code")

        if not code:
            return Response(
                {
                    "error": "GitHub authorization code is missing."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        client_id = os.getenv("GITHUB_CLIENT_ID")
        client_secret = os.getenv("GITHUB_CLIENT_SECRET")

        redirect_uri = (
            "http://127.0.0.1:8000/api/auth/github/callback/"
        )

        # Exchange authorization code for access token
        token_response = requests.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code,
                "redirect_uri": redirect_uri,
            },
            headers={
                "Accept": "application/json"
            }
        )

        if token_response.status_code != 200:
            return Response(
                {
                    "error": "Failed to get GitHub access token."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        token_data = token_response.json()

        access_token = token_data.get("access_token")

        if not access_token:
            return Response(
                {
                    "error": "GitHub access token was not received."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get GitHub user information
        user_response = requests.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json"
            }
        )

        if user_response.status_code != 200:
            return Response(
                {
                    "error": "Failed to get GitHub user information."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        github_user = user_response.json()

        github_id = github_user.get("id")
        github_username = github_user.get("login")
        name = github_user.get("name")

        # GitHub may not expose the email publicly
        email = github_user.get("email")

        # Get email from GitHub email API if necessary
        if not email:

            email_response = requests.get(
                "https://api.github.com/user/emails",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json"
                }
            )

            if email_response.status_code == 200:

                emails = email_response.json()

                primary_email = next(
                    (
                        item["email"]
                        for item in emails
                        if item.get("primary") and item.get("verified")
                    ),
                    None
                )

                email = primary_email

        if not email:
            return Response(
                {
                    "error": "Could not retrieve email from GitHub."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find existing Django user
        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:

            # Create a unique username
            username = github_username

            if User.objects.filter(username=username).exists():

                username = f"{github_username}_{github_id}"

            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=name or github_username
            )

        # Log the user in using Django session authentication
        login(request, user)

        # Redirect to React dashboard
        return redirect(
            "http://localhost:5173/dashboard"
        )


class ForgotPasswordView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "No account found with this email"},
                status=status.HTTP_404_NOT_FOUND
            )

        if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
            logger.error("Password reset email settings are not configured.")
            return Response(
                {"error": "Password reset email service is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        token = default_token_generator.make_token(user)
        reset_link = (
            f"{settings.FRONTEND_URL}/reset-password/{user.id}/{token}/"
        )
        message = f"""
Hello {user.first_name},

You requested to reset your password.

Click the link below to create a new password:

{reset_link}

If you did not request this, you can safely ignore this email.

Regards,
AI Interviewer Team
"""
        try:
            sent_count = send_mail(
                subject="Reset Your Password",
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except (OSError, smtplib.SMTPException):
            logger.exception("Failed to send password reset email.")
            return Response(
                {"error": "Could not send the reset email. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        if sent_count != 1:
            logger.error("Password reset email was not accepted for delivery.")
            return Response(
                {"error": "Could not send the reset email. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        return Response(
            {"message": "Password reset link sent to your email"},
            status=status.HTTP_200_OK
        )



class ResetPasswordView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get("user_id")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not user_id or not token or not new_password:
            return Response(
                {"error": "User ID, token and new password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid user"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify token
        if not default_token_generator.check_token(user, token):
            return Response(
                {"error": "Invalid or expired reset token"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Change password
        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password reset successful"},
            status=status.HTTP_200_OK
        )