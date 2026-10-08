from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase


class LoginCsrfTests(APITestCase):
    def setUp(self):
        get_user_model().objects.create_user(username="csrfuser", password="Test_123")
        self.client = APIClient(enforce_csrf_checks=True)
        self.credentials = {"username": "csrfuser", "password": "Test_123"}

    def test_login_requires_csrf(self):
        self.assertEqual(self.client.post(reverse("login"), self.credentials).status_code, 403)

    def test_login_and_logout_with_rotated_token(self):
        token = self.client.get(reverse("csrf-token")).json()["csrfToken"]
        response = self.client.post(reverse("login"), self.credentials, HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, 200)
        token = self.client.get(reverse("csrf-token")).json()["csrfToken"]
        self.assertEqual(self.client.post(reverse("logout"), HTTP_X_CSRFTOKEN=token).status_code, 200)
