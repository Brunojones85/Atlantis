#define trigPin 2
#define echoPin 3
#define LED 4
#define LED2 5

#include <SPI.h>
#include <Ethernet.h>

// Utilize o endereço MAC que está na etiqueta branca da
// sua Galielo
byte mac[] = { 0x98, 0x4F, 0xEE, 0x05, 0x91, 0x9D };
IPAddress server(45, 55, 170, 244);

EthernetClient client;

// Variaveis led_pisca
unsigned long mais_recente_led = 0;
int estado_led = 0;

// Variaveis led_pisca
unsigned long mais_recente_led2 = 0;
int estado_led2 = 0;

// Variaveis envia_dados
unsigned long mais_recente_dados = 0;
unsigned long ultimo_interacao = 0;

int velocidade_led = 1000;

void setup() {
    Serial.begin(9600);
    system("ifup eth0");
    Serial.println("Tentando obter um IP:");
    while (!Ethernet.begin(mac)) {
        Serial.println("Erro ao conectar");
    }
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
    pinMode(LED, OUTPUT);
    pinMode(LED2, OUTPUT);

   delay(3000);
    Serial.print("Meu endereco:");
    Serial.println(Ethernet.localIP());

}



void ler_dados () {
    if (client.available()) {
        char c = client.read();
        Serial.print(c);
        ultimo_interacao = millis();
    }
}

void fecha_dados () {
    unsigned long atual = millis();
    if (atual - ultimo_interacao >= 500 && client.connected()) {
        client.stop();
        Serial.println("Desconectado");
    }
}

void envia_dados () {
    unsigned long atual = millis();
    if (atual - mais_recente_dados > 1000 && !client.connected()) {
        float distance = medir_distancia ();
        if (client.connect(server, 3000)) {
            mais_recente_dados = atual;
            Serial.println("Conectado ao servidor\n\n");
            client.print("GET /");
            client.print(distance);
            client.println(" HTTP/1.0");
            client.println("Host: 45.55.170.244:8080");
            client.println();
            ultimo_interacao = millis();
        }
    }
}

void led_pisca () {
    unsigned long atual = millis();
    if (atual - mais_recente_led > velocidade_led) {
        mais_recente_led = atual;
        digitalWrite(LED, estado_led);
        estado_led = !estado_led;
    }
}

void led_pisca2 () {
    unsigned long atual = millis();
    if (atual - mais_recente_led2 > 5000) {
        mais_recente_led2 = atual;
        digitalWrite(LED2, estado_led2);
        estado_led2 = !estado_led2;
    }
}

float medir_distancia () {
    long duration;
    float distance;
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    duration = pulseIn(echoPin, HIGH);
    distance = (duration / 2.0) / 29.1;
    if (distance >= 200 || distance <= 0) {
        Serial.println("fora de alcance");
        return -1.0;
    }
    Serial.print(distance);
    Serial.println(" cm");
    client.print(distance);
    velocidade_led = distance * 15;
    return distance;
}

void loop() {
    led_pisca ();
    led_pisca2 ();
    envia_dados ();
    ler_dados ();
    fecha_dados ();
}
