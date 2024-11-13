import wlkatapython
import serial
'''robotic arm home'''
#serial1 = serial.Serial("COM3",  38400)#Set the serial port and baud rate
serial1 = serial.Serial("/dev/cu.usbserial-1420", 115200)  # Puerto y tasa de baudios ajustados
mirobot1 =wlkatapython.Wlkata_UART()#Create object mirobot1 
mirobot1.init(serial1,  1)#Set robotic arm address
mirobot1.homing()#Robotic arm homing
serial1.close()#Close serial port
