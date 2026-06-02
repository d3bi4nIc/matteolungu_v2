@echo off
REM Pornește site-ul + CMS-ul local pe http://localhost:8000
REM Necesită PHP (instalat). Dacă "php" nu e recunoscut, deschide un terminal NOU
REM (PATH-ul se actualizează după instalarea PHP) sau repornește calculatorul.

echo.
echo  Matteo Lungu - server local
echo  Site:  http://localhost:8000
echo  Admin: http://localhost:8000/admin/   (parola: matteo2026)
echo.
echo  Apasa Ctrl+C ca sa opresti serverul.
echo.

php -c php.dev.ini -S localhost:8000
pause
