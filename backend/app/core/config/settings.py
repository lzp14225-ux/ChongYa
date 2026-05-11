"""应用配置读取，负责从 backend/.env 加载环境变量。"""

import os
from pathlib import Path


def _load_backend_env() -> None:
    env_path = Path(__file__).resolve().parents[3] / ".env"
    if not env_path.exists():
        return

    for line in env_path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def _split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def _required_env(key: str) -> str:
    value = os.getenv(key)
    if value is None or value.strip() == "":
        raise RuntimeError(f"缺少必填环境变量：{key}，请在 backend/.env 中配置")
    return value.strip()


def _required_bool_env(key: str) -> bool:
    value = _required_env(key).lower()
    if value not in {"true", "false"}:
        raise RuntimeError(f"环境变量 {key} 只能配置为 true 或 false")
    return value == "true"


def _required_int_env(key: str) -> int:
    value = _required_env(key)
    try:
        return int(value)
    except ValueError as exc:
        raise RuntimeError(f"环境变量 {key} 必须是整数") from exc


_load_backend_env()


class Settings:
    app_name: str = _required_env("APP_NAME")
    app_env: str = _required_env("APP_ENV")
    app_debug: bool = _required_bool_env("APP_DEBUG")
    app_host: str = _required_env("APP_HOST")
    app_port: int = _required_int_env("APP_PORT")

    database_url: str = _required_env("DATABASE_URL")
    cors_origins: list[str] = _split_csv(_required_env("CORS_ORIGINS"))

    jwt_secret_key: str = _required_env("JWT_SECRET_KEY")
    jwt_algorithm: str = _required_env("JWT_ALGORITHM")
    jwt_expire_minutes: int = _required_int_env("JWT_EXPIRE_MINUTES")

    log_dir: str = _required_env("LOG_DIR")
    log_level: str = _required_env("LOG_LEVEL")
    login_log_file: str = _required_env("LOGIN_LOG_FILE")
    error_log_file: str = _required_env("ERROR_LOG_FILE")
    log_max_bytes: int = _required_int_env("LOG_MAX_BYTES")
    log_backup_count: int = _required_int_env("LOG_BACKUP_COUNT")


settings = Settings()
