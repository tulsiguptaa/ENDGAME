import smtplib
from types import SimpleNamespace
from unittest.mock import patch

from django.test import SimpleTestCase, override_settings
from rest_framework.test import APIRequestFactory

from .views import ForgotPasswordView, ResetPasswordView


class ForgotPasswordEmailTests(SimpleTestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = SimpleNamespace(
            id=41,
            email="person@example.com",
            first_name="Test",
        )

    def test_password_reset_endpoints_do_not_use_session_authentication(self):
        for view in (ForgotPasswordView, ResetPasswordView):
            with self.subTest(view=view.__name__):
                self.assertEqual(view.authentication_classes, [])
                self.assertEqual(view.permission_classes[0].__name__, "AllowAny")

    def submit_request(self):
        request = self.factory.post(
            "/api/auth/forgot-password/",
            {"email": self.user.email},
            format="json",
        )
        return ForgotPasswordView.as_view()(request)

    @override_settings(
        EMAIL_HOST_USER="sender@gmail.com",
        EMAIL_HOST_PASSWORD="app-password",
        DEFAULT_FROM_EMAIL="sender@gmail.com",
        FRONTEND_URL="http://localhost:5173",
    )
    def test_sends_reset_link_using_configured_frontend_url(self):
        with (
            patch(
                "accounts.views.User.objects.get",
                return_value=self.user,
            ),
            patch(
                "accounts.views.default_token_generator.make_token",
                return_value="test-token",
            ),
            patch("accounts.views.send_mail", return_value=1) as send_mail,
        ):
            response = self.submit_request()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            send_mail.call_args.kwargs["recipient_list"],
            [self.user.email],
        )
        self.assertIn(
            "http://localhost:5173/reset-password/41/test-token/",
            send_mail.call_args.kwargs["message"],
        )

    @override_settings(
        EMAIL_HOST_USER="sender@gmail.com",
        EMAIL_HOST_PASSWORD="app-password",
        DEFAULT_FROM_EMAIL="sender@gmail.com",
    )
    def test_reports_smtp_authentication_failure(self):
        with (
            patch(
                "accounts.views.User.objects.get",
                return_value=self.user,
            ),
            patch(
                "accounts.views.default_token_generator.make_token",
                return_value="test-token",
            ),
            patch(
                "accounts.views.send_mail",
                side_effect=smtplib.SMTPAuthenticationError(
                    535,
                    b"Authentication failed",
                ),
            ),
        ):
            response = self.submit_request()

        self.assertEqual(response.status_code, 503)
        self.assertIn("Could not send", response.data["error"])

    @override_settings(EMAIL_HOST_USER="", EMAIL_HOST_PASSWORD="")
    def test_reports_missing_smtp_credentials(self):
        with patch(
            "accounts.views.User.objects.get",
            return_value=self.user,
        ), patch("accounts.views.send_mail") as send_mail:
            response = self.submit_request()

        self.assertEqual(response.status_code, 503)
        send_mail.assert_not_called()
