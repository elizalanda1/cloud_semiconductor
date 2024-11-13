#version python 3.4
#coding=utf-8
from mirobot import *
from time import sleep
api=Mirobot()
#Please do not delete the above code
#api.home_simultaneous()
#sleep(15)

api.forward(1)  # Mueve el robot hacia adelante
sleep(1)       # Espera un segundo para observar el movimiento
api.back(1)     # Mueve el robot hacia atrás
