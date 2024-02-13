@echo off
cd ..\

echo Creating new venv...
python -m venv --upgrade-deps .venv

echo Installing dependencies...
.venv\Scripts\python.exe -m pip install -r requirements.txt

echo Setup finished!
pause