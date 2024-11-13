from mirobot import Mirobot

with Mirobot(portname='/dev/cu.usbserial-1420', debug=True) as m:
   
    m.home_simultaneous()