from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from rest_framework.exceptions import ValidationError
from rest_framework.test import APITestCase

from apps.files.models import StoredFile
from apps.files.serializers import UploadFileSerializer
from apps.files.services import upload_file
from common.downloads import file_response


class UploadLimitsTests(APITestCase):
    @override_settings(MAX_UPLOAD_BYTES=3)
    def test_large_file_rejected(self):
        serializer = UploadFileSerializer(data={"file": SimpleUploadedFile("large.txt", b"1234")})
        self.assertFalse(serializer.is_valid())

    @override_settings(MAX_USER_STORAGE_BYTES=3)
    def test_quota_rejected_before_disk_write(self):
        user = get_user_model().objects.create_user(username="quota")
        with self.assertRaises(ValidationError):
            upload_file(owner=user, uploaded_file=SimpleUploadedFile("large.txt", b"1234"))
        self.assertFalse(StoredFile.objects.exists())

    def test_html_cannot_be_previewed_inline(self):
        with BytesIO(b"<script></script>") as handle:
            response = file_response(StoredFile(original_name="test.html"), handle, True)
            self.assertTrue(response["Content-Disposition"].startswith("attachment"))
            self.assertEqual(response["Content-Type"], "application/octet-stream")
