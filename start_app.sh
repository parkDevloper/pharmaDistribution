#!/bin/bash

# Start backend in new Windows CMD window running WSL
cmd.exe /c start wsl bash -c "cd '$PWD/backend' && source ~/.bashrc && python manage.py runserver"

# Start frontend in new Windows CMD window running WSL
cmd.exe /c start wsl bash -c "cd '$PWD/frontend' && source ~/.bashrc && npm start"
