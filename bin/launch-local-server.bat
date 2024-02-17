@echo off
cd ..

:START
cls
.venv\Scripts\python.exe -m flask --app main.py run
GOTO START

pause