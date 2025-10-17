#!/bin/bash
# Railway start script for AI Safety Empire

# Start the standalone API (simplest, most complete)
cd standalone-api
pip install -r requirements.txt
uvicorn app_v2:app --host 0.0.0.0 --port $PORT

