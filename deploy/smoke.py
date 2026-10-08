import http.cookiejar
import json
import secrets
import urllib.request

base = "https://cloud.mu56.ru/api"
origin = "https://mycloud.mu56.ru"
client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))


def request(path, data=None, method=None, content_type="application/json"):
    headers = {"Origin": origin}
    if data is not None:
        token = json.load(client.open(base + "/users/csrf/"))["csrfToken"]
        headers.update({"X-CSRFToken": token, "Content-Type": content_type})
    req = urllib.request.Request(base + path, data=data, headers=headers, method=method)
    with client.open(req) as response:
        return response.status, response.read(), response.headers


username = "smoke" + secrets.token_hex(4)
password = secrets.token_urlsafe(24) + "A1!"
status, _, _ = request("/users/register/", json.dumps({
    "username": username, "email": username + "@example.com", "password": password,
}).encode())
assert status == 201
assert request("/users/login/", json.dumps({"username": username, "password": password}).encode())[0] == 200
assert json.loads(request("/users/me/")[1])["username"] == username
boundary = secrets.token_hex(16)
body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"smoke.txt\"\r\n"
        f"Content-Type: text/plain\r\n\r\nmycloud smoke test\r\n--{boundary}--\r\n").encode()
status, result, _ = request("/files/", body, content_type="multipart/form-data; boundary=" + boundary)
assert status == 201
file_id = json.loads(result)["file"]["id"]
assert request(f"/files/{file_id}/download/")[1] == b"mycloud smoke test"
request(f"/files/{file_id}/", b"{}", method="DELETE")
assert request("/users/logout/", b"{}")[0] == 200
print("PASS: HTTPS, registration, CSRF login, session, upload, download, deletion, logout")
print("Disposable non-admin smoke account:", username)
