"""日志初始化，负责创建日志目录并配置认证日志和错误日志文件输出。"""

import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

from app.core.config.settings import settings
from app.core.logging.formatter import JsonFormatter


def setup_logging() -> None:
    log_dir = Path(settings.log_dir)
    log_dir.mkdir(parents=True, exist_ok=True)

    login_log_path = log_dir / settings.login_log_file
    login_handler = RotatingFileHandler(
        login_log_path,
        maxBytes=settings.log_max_bytes,
        backupCount=settings.log_backup_count,
        encoding="utf-8",
    )
    login_handler.setFormatter(JsonFormatter())
    login_handler.setLevel(settings.log_level)

    login_logger = logging.getLogger("auth.login")
    login_logger.handlers.clear()
    login_logger.addHandler(login_handler)
    login_logger.setLevel(settings.log_level)
    login_logger.propagate = False

    error_log_path = log_dir / settings.error_log_file
    error_handler = RotatingFileHandler(
        error_log_path,
        maxBytes=settings.log_max_bytes,
        backupCount=settings.log_backup_count,
        encoding="utf-8",
    )
    error_handler.setFormatter(JsonFormatter())
    error_handler.setLevel(logging.ERROR)

    error_logger = logging.getLogger("app.error")
    error_logger.handlers.clear()
    error_logger.addHandler(error_handler)
    error_logger.setLevel(logging.ERROR)
    error_logger.propagate = False
