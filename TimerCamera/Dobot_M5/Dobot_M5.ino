#include <ESP32Servo.h>

Servo myServo;
int servoPin = 13;  // El pin donde conectaste el servo

void setup() {
  Serial.begin(115200);  // Inicia comunicación serial
  myServo.attach(servoPin);
  myServo.write(90);  // Posición inicial del servo
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();

    if (command == 'O') {        // Si recibe 'O', abre el servo
      myServo.write(0);          // Ajusta el ángulo para abrir el agarre
    } else if (command == 'C') { // Si recibe 'C', cierra el servo
      myServo.write(180);        // Ajusta el ángulo para cerrar el agarre
    }
  }
}
