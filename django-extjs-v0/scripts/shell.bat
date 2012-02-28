@ECHO OFF


:BEGIN
cd %~dp0
manage.py shell
GOTO BEGIN
 
