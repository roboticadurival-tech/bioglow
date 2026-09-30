#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// ---------- Wi-Fi ----------
const char* WIFI_SSID = "WIFI FAROL MOVEL";
const char* WIFI_PASSWORD = "#CTAC04043.0725";

// ---------- MQTT ----------
const char* MQTT_HOST = "192.168.14.18"; // IP do seu PC (ipconfig)
const int   MQTT_PORT = 1883;
const char* MQTT_USER = "esp32-dev";
const char* MQTT_PASSWORD = "SUA_SENHA_DO_ESP";
const char* MQTT_TOPIC = "apiario/01/colmeia/03/telemetria";

// ---------- Sensor ----------
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient;
PubSubClient mqtt(espClient);

void conectarWifi() {
  Serial.print("Conectando ao Wi-Fi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Wi-Fi conectado! IP: ");
  Serial.println(WiFi.localIP());
}

void conectarMqtt() {
  while (!mqtt.connected()) {
    Serial.print("Conectando ao MQTT...");
    String clientId = "esp32-colmeia03-" + String(random(0xffff), HEX);

    if (mqtt.connect(clientId.c_str(), MQTT_USER, MQTT_PASSWORD)) {
      Serial.println(" conectado!");
    } else {
      Serial.print(" falhou, rc=");
      Serial.print(mqtt.state());
      Serial.println(" tentando de novo em 3s");
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  conectarWifi();
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
}

void loop() {
  if (!mqtt.connected()) {
    conectarMqtt();
  }
  mqtt.loop();

  float umidade = dht.readHumidity();
  float temperatura = dht.readTemperature();

  if (isnan(umidade) || isnan(temperatura)) {
    Serial.println("Falha na leitura do DHT11, pulando este envio.");
    delay(5000);
    return;
  }

  // ATENÇÃO: peso_kg e bateria_v ainda não têm sensor real.
  // Uso valores fixos só para o backend aceitar a validação por enquanto.
  StaticJsonDocument<200> json;
  json["peso_kg"] = 0.0;
  json["temp_interna"] = temperatura;
  json["umidade_interna"] = umidade;
  json["bateria_v"] = 4.0;

  char payload[200];
  serializeJson(json, payload);

  Serial.print("Publicando: ");
  Serial.println(payload);

  mqtt.publish(MQTT_TOPIC, payload);

  delay(10000); // envia a cada 10 segundos, para teste
}