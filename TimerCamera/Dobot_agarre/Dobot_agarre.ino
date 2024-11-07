#include <M5Atom.h>
#include <ServoESP32.h>

Servo servo1;

void setup() {
  M5.begin();
  servo1.attach(23);  // Cambia el pin si usas otro en tu M5Atom

  M5.dis.drawpix(0, 0x00FF00);  // Indicador visual en el M5Atom
}

void loop() {
  // Abre el agarre
  servo1.write(0);  // Ajusta los ángulos según tus necesidades
  delay(1000);

  // Cierra el agarre
  servo1.write(90);
  delay(1000);
}
