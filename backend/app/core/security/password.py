"""密码校验工具，使用标准库 pbkdf2_sha256，并兼容当前明文存量密码。"""

import hashlib
import hmac
import secrets
from typing import Optional

PBKDF2_SCHEME = "pbkdf2_sha256"
PBKDF2_ITERATIONS = 260000


def hash_password(plain_password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        plain_password.encode("utf-8"),
        salt.encode("utf-8"),
        PBKDF2_ITERATIONS,
    ).hex()
    return f"{PBKDF2_SCHEME}${PBKDF2_ITERATIONS}${salt}${digest}"


def verify_password(plain_password: str, stored_password: Optional[str]) -> bool:
    if not stored_password:
        return False
    if stored_password.startswith(f"{PBKDF2_SCHEME}$"):
        try:
            _, iterations, salt, expected_digest = stored_password.split("$", 3)
            actual_digest = hashlib.pbkdf2_hmac(
                "sha256",
                plain_password.encode("utf-8"),
                salt.encode("utf-8"),
                int(iterations),
            ).hex()
        except ValueError:
            return False
        return hmac.compare_digest(actual_digest, expected_digest)
    if stored_password.startswith(("$bcrypt-sha256$", "$2a$", "$2b$", "$2y$")):
        try:
            from passlib.context import CryptContext
        except ModuleNotFoundError:
            return False
        return CryptContext(schemes=["bcrypt_sha256", "bcrypt"], deprecated="auto").verify(plain_password, stored_password)
    return plain_password == stored_password
