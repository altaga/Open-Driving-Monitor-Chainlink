import paho.mqtt.client as mqtt
import json
import time
import requests
import json

url = "https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/post-db"

# Constants Colors

class_colors = {
    "Angry": "#FF0000",      # Red
    "Disgust": "#800080",    # Purple
    "Fear": "#000080",       # Navy
    "Happy": "#FFD700",      # Gold
    "Sad": "#0000FF",        # Blue
    "Surprise": "#00FF00",   # Lime
    "Neutral": "#808080"     # Gray
}

# Define event callbacks
def on_connect(mqttc, userdata, flags, rc):
    ...
    #print("rc: " + str(rc))

def on_publish(client, obj, mid):
    ...
    #print("mid: " + str(mid))

# Utils
loop = 60
id = 2

# Certs

EndPoint = "xxxxxxxx.iot.us-east-1.amazonaws.com"
caPath = "opencvDNN/certs/aws-iot-rootCA.crt"
certPath = "opencvDNN/certs/aws-iot-device.pem"
keyPath = "opencvDNN/certs/aws-iot-private.key"

# Main code
mqttc = mqtt.Client()

# Assign event callbacks
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish
mqttc.tls_set(
    ca_certs=caPath,
    certfile=certPath,
    keyfile=keyPath,
    tls_version=2)

mqttc.connect(EndPoint, 8883, keepalive=60)

# Continue the network loop, exit when an error occurs
rc = 0

while rc == 0:
    rc = mqttc.loop()
    if(time.time()-loop > 60): # Update Every 15 Seconds
        loop = time.time()
        try:
            drowsiness = {}
            drowsinessState = "Drowsiness"
            with open('opencvDNN/Drowsiness/drowsiness.json') as f:
                drowsiness = json.load(f)

            if drowsiness["state"]:
                drowsinessState="Awake"

            emotion = {}
            with open('opencvDNN/Emotions/emotion.json') as f:
                emotion = json.load(f)

            gps = {}
            with open('opencvDNN/Gps/gps.json') as f:
                gps = json.load(f)

            dataMQTT = { "coordinates": [gps["lng"],gps["lat"]], "color":class_colors[emotion["emotion"]],  "data":"Emotion: {}\nState: {}".format(emotion["emotion"],drowsinessState), "id": id}
            #print(dataMQTT)
            mqttc.publish("/ODM/devices", json.dumps(dataMQTT))
            # Chainlink 
            sensors = {}
            with open('opencvDNN/Sensors/sensors.json') as f:
                sensors = json.load(f)

            url = "https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/get-db?id=" + str(id)
            response = requests.request("GET", url, headers={}, data={})
            uri = response.json()["uri"]
            
            carInstance = {
                "id": str(id),
                "uri": uri,
                "data":json.dumps({
                    "location": [
                        round(gps["lng"],4),
                        round(gps["lat"],4)
                    ],
                    "eyeStatus": drowsiness["state"], 
                    "emotion": emotion["emotion"], 
                    "environment": {
                            "temperature": sensors["temperature"],
                            "humidity": sensors["humidity"],
                            "light": sensors["light"],
                            "pressure": sensors["pressure"],
                            "airq": sensors["airq"],
                            "gyroX": sensors["gyroX"],
                            "gyroY": sensors["gyroY"],
                            "gyroZ": sensors["gyroZ"],
                            "accelX": sensors["accelX"],
                            "accelY": sensors["accelY"],
                            "accelZ": sensors["accelZ"],
                            "magX": sensors["magX"],
                            "magY": sensors["magY"],
                            "magZ": sensors["magZ"]
                        }
                })
            }
            mqttc.publish("/ODM/devicesChainlink", json.dumps(carInstance))
            print(carInstance)
        except Exception as e:
            print(e)
            ...
        

print("rc: " + str(rc))