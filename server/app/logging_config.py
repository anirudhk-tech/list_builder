import logging
import sys

def configure_root_logger():
    if logging.root.handlers:
        return

    logging.basicConfig(
        level=logging.DEBUG,           
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
        stream=sys.stdout,
    )

def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
