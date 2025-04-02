#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

const char* ssid = "Your Wifi Name";
const char* password = "WifiPasswordHere";

//Your Domain name with URL path or IP address with path
String serverName = "http://raspberrypi.local/api/collections/tempandhumidity/records";

unsigned long lastTime = 0;
unsigned long timerDelay = 120000; // This is in milliseconds

#define DHTPIN 15

#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200); 

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
 
  Serial.println("Timer set to 15 seconds (timerDelay variable), it will take 15 seconds before publishing the first reading.");
  
  dht.begin();
  registerDevice();
}

void loop() {
  sendTemp();
}

void registerDevice() {
  if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;

      String serverPath = String("http://raspberrypi.local/registerdevice") + String("?deviceid=") + String(ESP.getEfuseMac());
      
      http.begin(serverPath.c_str());

      int httpResponseCode = http.POST("");
     
     if (httpResponseCode>0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
}

void sendTemp() {
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
    
      // Your Domain name with URL path or IP address with path
      http.begin(client, serverName);
      
      // If you need an HTTP request with a content type: application/json, use the following:
      http.addHeader("Content-Type", "application/json");
      // JSON data to send with HTTP POST
      String httpRequestData = "{\"temp\":\"" + String(dht.readTemperature()) + "\",\"humidity\":\"" + String(dht.readHumidity()) + "\",\"device\":\"" + String(ESP.getEfuseMac()) + "\"}";
      // Send HTTP POST request
      int httpResponseCode = http.POST(httpRequestData);
      
     
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
        
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
