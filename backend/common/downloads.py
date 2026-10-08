import mimetypes

from django.http import FileResponse


def file_response(stored_file, file_handle, requested_inline):
    content_type = mimetypes.guess_type(stored_file.original_name)[0]
    inline = requested_inline and content_type in {
        "image/png", "image/jpeg", "image/gif", "image/webp", "application/pdf",
    }
    response = FileResponse(
        file_handle,
        as_attachment=not inline,
        filename=stored_file.original_name,
        content_type=content_type if inline else "application/octet-stream",
    )
    response["X-Content-Type-Options"] = "nosniff"
    response["Content-Security-Policy"] = "sandbox; default-src 'none'"
    return response
