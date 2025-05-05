import logging
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path

def configure_root_logger(logfile: str = "logs/app.log"):
    for h in logging.root.handlers[:]: # Clear out any old handlers
        logging.root.removeHandler(h)

    log_path = Path(logfile)
    log_path.parent.mkdir(parents=True, exist_ok=True)

    # (1) Create a rotating file handler
    file_handler = RotatingFileHandler(
        filename=str(logfile),
        mode="a",              # append
        maxBytes=10 * 1024**2, # rotate after ~10 MB
        backupCount=5,         # keep 5 old files
        encoding="utf-8",
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(logging.Formatter(
        "%(asctime)s %(levelname)s %(name)s: %(message)s"
    ))

    # (2) keep stdout logging too
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setLevel(logging.INFO)
    stream_handler.setFormatter(logging.Formatter(
        "%(asctime)s %(levelname)s %(name)s: %(message)s"
    ))

    # (3) Configure the root logger
    root = logging.getLogger()
    root.setLevel(logging.DEBUG)
    root.addHandler(file_handler)
    root.addHandler(stream_handler)


def get_logger(name: str) -> logging.Logger:
    # make sure you've already called configure_root_logger()
    return logging.getLogger(name)
