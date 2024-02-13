@echo off
cd ..\src

..\.venv\Scripts\python.exe -m flask --app main.py run

pause