#!/bin/bash
export FLASK_APP=backend/app.py
python -m flask run > flask_run.log 2>&1
