@ECHO OFF

SET PORT=9000

:BEGIN
cd %~dp0
manage.py runconcurrentserver 0.0.0.0:%PORT%
GOTO BEGIN
 
