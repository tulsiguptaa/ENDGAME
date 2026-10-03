from django.urls import path
from .views import (
    SignupView,
    LoginView,
    LogoutView,
    CurrentUserView,
    GoogleLoginView,
    GoogleCallbackView,
    GitHubCallbackView,
    GitHubLoginView
)

urlpatterns = [

    path( "signup/",SignupView.as_view(),name="signup" ),

    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),

    path(
        "logout/",
        LogoutView.as_view(),
        name="logout"
    ),

    path(
        "me/",
        CurrentUserView.as_view(),
        name="current-user"
    ),
    
    path( "google/", GoogleLoginView.as_view(), name="google-login", ),
    path( "google/callback/", GoogleCallbackView.as_view(), name="google-callback", ),
    path("github/", GitHubLoginView.as_view(), name="github-login"), 
    path( "github/callback/", GitHubCallbackView.as_view(), name="github-callback" ),
]