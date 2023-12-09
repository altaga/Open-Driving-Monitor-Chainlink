import asyncio
from bleak import BleakClient
import struct
import time
import datetime
import json

address = '00:60:37:0A:AB:D6'

uuidDir = {
  "temperature": "1305b3ca-096e-4366-9f68-1ae8df01f279",
  "humidity": "1305b3ca-096e-4366-9f68-1ae8df01f27a",
  "light": "1305b3ca-096e-4366-9f68-1ae8df01f27b",
  "pressure": "1305b3ca-096e-4366-9f68-1ae8df01f27c",
  "airq": "1305b3ca-096e-4366-9f68-1ae8df01f27d",
  #"TapCountChar": "1305b3ca-096e-4366-9f68-1ae8df01f27e",
  "gyroX": "159499cd-113c-480e-9a7f-2eb10f0222b2",
  "gyroY": "159499cd-113c-480e-9a7f-2eb10f0222b3",
  "gyroZ": "159499cd-113c-480e-9a7f-2eb10f0222b4",
  "accelX": "159499cd-113c-480e-9a7f-2eb10f0222b5",
  "accelY": "159499cd-113c-480e-9a7f-2eb10f0222b6",
  "accelZ": "159499cd-113c-480e-9a7f-2eb10f0222b7",
  "magX": "159499cd-113c-480e-9a7f-2eb10f0222b8",
  "magY": "159499cd-113c-480e-9a7f-2eb10f0222b9",
  "magZ": "159499cd-113c-480e-9a7f-2eb10f0222ba"
}

ct = datetime.datetime.now()

async def main(address):
    while True:
        try:
            data=uuidDir
            flag = True
            async with BleakClient(address) as client:
                for key in uuidDir.keys():
                    try:
                        if(
                            key == 'light' or
                            key == 'pressure' or
                            key == 'airq' or
                            key == 'TapCountChar'
                        ):
                            value = await client.read_gatt_char(uuidDir[key])
                            data[key] = struct.unpack('I', value)[0]
                            #print("{0}: {1}".format(key, struct.unpack('I', value)))
                        else:
                            value = await client.read_gatt_char(uuidDir[key])
                            exponent = 4
                            data[key] = round(struct.unpack('<f', value)[0],exponent)
                            #print("{0}: {1}".format(key, struct.unpack('<f', value)))
                    except:
                        flag = False
                        #print("Non Readable")
            print("Timestamp: ", datetime.datetime.now())
            print("Data: ",data)
            if(flag):
                with open("sensors.json", "w") as outfile:
                #with open("opencvDNN/Sensors/sensors.json", "w") as outfile:
                    json.dump(data, outfile) 
                print("")
            time.sleep(10)
        except:
            print("Error")

asyncio.run(main(address))