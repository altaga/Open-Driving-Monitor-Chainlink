# Open Driving Monitor

Drowsiness, Blind Spot, and Emotions Monitor system for driving intended for conventional automobiles and and heavy machinery. Its objective is to enhance safety through fatigue detection, blind spot awareness, and emotional state analysis, all powered by OpenCV.

<img src="https://i.ibb.co/Vm05pCc/Image.png" width="600">

# Fast Links:

### Video Demo:

Video Demo: Click on the image
[![Car](https://i.ibb.co/Vm05pCc/Image.png)](pending...)

### Web Platforms:

- Open Driving Marketplace: [CLICK HERE](https://open-driving-marketplace.vercel.app/)

- Open Driving Navigator: [CLICK HERE](https://open-driving-navigator.vercel.app/)

### AI Test Notebooks:

- Emotions: [CLICK HERE](./Emotions/test/Test_Emotions_DNN.ipynb)

- Drowsiness: [CLICK HERE](./Drowsiness/test/Test_Blink_DNN.ipynb)

- YoloV3: [CLICK HERE](./Yolo/test/LoadAndTestYolo.ipynb)

# Introduction:



<img src="https://i.ibb.co/HKC3yBh/e4264624281d816222229deed61c8e32.webp" width="600">

# Problem:



# Solution:

Contruimos una plataforma powered by Chainlink and AI models que es capas de monitorear continuamente el enviroment de vehiculos y con esta informacion generar una ficha de venta dNFT sobre la red de Polygon.

<img src="https://i.ibb.co/B4YMrSQ/image.png" width="1000">

Ademas de un sistema de hardware que se encarga de correr los modelos de AI y obtener los datos de los sensores.

<img src="https://i.ibb.co/WsggbsV/20231124-151109.jpg" width="600">

## Materials:

Online Platforms:
- Chainlink:
https://chain.link/
- Remix IDE:
https://remix.ethereum.org/
- Open Driving Marketplace:
https://open-driving-marketplace.vercel.app/
- Open Driving Navigator:
https://open-driving-navigator.vercel.app/
- Google Colab:
https://colab.research.google.com/
- AWS IoT:
https://aws.amazon.com/es/iot/
- Vercel:
https://vercel.com/

Software:
- Chainlink Functions SDK:
https://docs.chain.link/chainlink-functions
- Openzeppelin:
https://www.openzeppelin.com/
- OpenCV:
https://opencv.org/
- TensorFlow:
https://www.tensorflow.org/
- Raspberry Pi OS:
https://www.raspberrypi.com/software/
- YOLOv3:
https://pjreddie.com/darknet/yolo/
- NextJS 14:
https://nextjs.org/
- Open Layers Maps: 
https://openlayers.org/

Hardware:
- RaspberryPi 4 (4Gb) - x1.
https://www.raspberrypi.com/products/raspberry-pi-4-model-b/
- Power Inverter for car - x1.
https://www.amazon.com/s?k=power+inverter+truper&ref=nb_sb_noss_2
- HD webcam - x1.
https://www.logitech.com/en-eu/products/webcams.html
- LCD Screen - x1.
https://www.alibaba.com/product-detail/Original-3-5-7-10-1_1600479875551.html
- GY-NEO6MV2 (GPS module) - x1.
https://www.alibaba.com/product-detail/Merrillchip-GY-NEO6MV2-New-NEO-6M_1600953573665.html
- Mini Speaker - x1.
https://www.alibaba.com/product-detail/High-Quality-Wireless-Blue-Tooth-Speaker_1600990407880.html
- NXP Rapid IoT Prototyping Kit:
https://www.nxp.com/design/design-center/designs/nxp-rapid-iot-prototyping-kit:IOT-PROTOTYPING

## Connection Diagram:

<img src="https://i.ibb.co/42PdW13/software-Chain-drawio.png" width="1000">

This general connection diagram shows how through a camera we can obtain images of the driver or those of the streets to later obtain relevant data on the driver's alertness, his state of mind and the objects around the car. All fed back by our internal screen and our online web map.

- On-Chain:
  - Chainlink Functions: Las nuevas chainlink functions son utilizadas para poder relizar API Calls a nuestra API Off-Chain y actualizar los metadatos de cada uno de los dNFTs cuando se requiere.

  - Polygon: Esta red se utiliza ya que es una de las redes compatibles con Chainlink Functions y sus bajas gas fees.

  - IPFS: usamos el servicios de IPFS de NFT.Storage para realizar el almacenamiento de los metadatos de los NFTs y las imagenes.

- Off-Chain:
  - AWS DynamoDB: En esta base de datos actualizamos los valores de los sensores y los datos obtenidos de las AI de forma continua.

  - AWS IoT: usamos este servicio para comunicarnos de forma segura entre los sensores y el modulo AI hacia la cloud.

  - AWS API Gateway: Usamos este servicio como API principal para poder ser llamada por Chainlink Functions.

- Sensors:

  - NXP Rapid IoT Prototyping: Este combo de sensores nos permite medir muchos aspectos del auto y con esos datos poder genera un mejor reporte de sus condiciones y su valor en el tiempo.

- AI Module:
  - Eye State Detection: Through preprocessing in OpenCV haarcascades, OpenCV DNN and a frozen graph inference model (Tensor Flow), we obtain the driver's state of attention and drowsiness.. [Details](#drowsiness-model-training)
    
  - Emotions Identification: Through preprocessing in OpenCV haarcascades, OpenCV DNN and a frozen graph inference model (Tensor Flow), we obtain the driver's mood.[Details](#emotions-model-training)

  - YoloV3: Using OpenCV DNN and the famous network [YoloV3 from Darknet](https://pjreddie.com/darknet/) We carry out the identification of vehicles and pedestrians in the blind spot of the car. [Details](#yolov3-model-testing)

- Online Platforms:
  - Open Driving Monitor: Using a board enabled with OpenCV DNN, we created a system that can run the 3 AI models and also provide vehicle GPS information at all times. The selected board will be shown later. [Details](#board-setup)

  - Open Driving Navigator: Using the NextJS, Open Layers and Vercel framework, we create a map that allows us to display the cars that are on our platform in real time and their states.. [Details](#open-driving-navigator-webpage)

## Chainlink Functions:

Para nuestro proyecto es indispendable que los datos de cada uno de los automoviles registrados como dNFTs esten actualizados, sin embargo realizar esta actualizacion es un problema tecnico complicado. Para eso gracias a las Chainlink funtions y sus nuevos [Decentralized Oracle Network (DON)](https://docs.chain.link/chainlink-functions/resources/concepts) permiten computar API calls y proveer a los smart contracts de esa informacion mediante un modelo de suscripcion en la plataforma de ChainLink.

<img src="https://i.ibb.co/zPwcVdJ/software-Chainlink-Only-drawio.png" width="1000">

### Contract:

El contrato que tenemos en la blockchain para todo este proyecto tiene el siguiente codigo.

[dNFT Contract](./Contracts/OpenDrivingNFT.sol)

Lo primero que realizamos fue implementar en el contrato de ERC721 los modulos de Chainlink Functions.

    import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
    import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
    import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

    ...

    contract ODMContractNFT is
        ERC721URIStorage,
        ConfirmedOwner,
        FunctionsClient,
        ReentrancyGuard
    {

      ...

    }

Una vez realizado esto modificamos la funcion **sendRequest** para realiza un API Call a API Gateway de AWS, donde la API retorna la metadata mas actualizada del auto en forma de un URI de IPFS.

    string source =
      "const car = args[0];"
      "const apiResponse = await Functions.makeHttpRequest({"
      "url: `https://XXXXXXX.execute-api.us-east-1.amazonaws.com/get-db?id=${car}`"
      "});"
      "if (apiResponse.error) {"
      "throw Error('Request failed');"
      "}"
      "const { data } = apiResponse;"
      "return Functions.encodeString(data.uri);";

    ...

    function sendRequest(
        uint64 subscriptionId,
        string[] calldata args,
        uint256 _tokenId
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
        if (args.length > 0) req.setArgs(args); // Set the arguments for the request

        // Send the request and store the request ID
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        lastTokenId = _tokenId;
        return s_lastRequestId;
    }

La segunda funcion a modificar fue **fulfillRequest** ya que al recibir la nueva URI esta tenia que ser capaz de actualizar el URI asociado con el token.

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId); // Check if request IDs match
        }
        // Update the contract's state variables with the response and any errors
        s_lastResponse = response;
        s_lastError = err;

        // Update NFT data
        _setTokenURI(lastTokenId, string(response));
        lastURI = string(response);

        // Emit an event to log the response
        emit Response(
            requestId,
            toString(lastTokenId),
            s_lastResponse,
            s_lastError
        );
    }

### Chainlink Functions Platform:

Ya con todas las funciones implementadas correctamente, solo quedo desplegar el contrato. Pero faltaba algo mas teniamos que hacer que nuestro contrato pudiera consumir la funcion en Chainlink, asi que tuvimos que crear una subscripcion en https://functions.chain.link.

<img src="https://i.ibb.co/vdLhMts/image.png" width="600">

Apesar de que es un proceso muy sencillo encontramos el siguiente mensaje al tratar de realizar el funding de nuestra subscripcion.

<img src="https://i.ibb.co/y8J8WbQ/Screenshot-2023-12-07-150720.png" width="600">

Esto fue una sorpresa para nosotros porque ya teniamos LINK en nuestra wallet, sin embargo en la seccion de wallet encontramos el problema.

<img src="https://i.ibb.co/Y8sdGww/Screenshot-2023-12-07-150930.png" width="600">

As que todo lo que fue necesario hacer, fue realizar el swap de LINK en la pagina https://pegswap.chain.link/.

<img src="https://i.ibb.co/t8Gmg07/Screenshot-2023-12-07-150913.png" width="600">

Una vez realizado el swap fue posible realizar el funding de nuestra subscripcion.

<img src="https://i.ibb.co/5WN600v/Screenshot-2023-12-07-151247-Copy.png" width="600">

Y por ultimo solo tuvimos que agregar nuestro contrato como consumer de la subscripcion.

<img src="https://i.ibb.co/pwjTY0J/Screenshot-2023-12-07-151317.png" width="600">

Una vez realizado esto y llamar desde nuestro contrato la funcion **sendRequest** podiamos ver como chainlink recibia la peticion y nos proporcionaba unos segundos despues el dato en el contrato.

<img src="https://i.ibb.co/yq151CV/Screenshot-2023-12-07-155947.png" width="600">

## AI Models and Sensors:

Todos estos modelos y sensores tienen como finalidad en el proyecto proveer un valor agregado al poder relizar mediciones del auto en tiempo real es posible realizar una mejor valoracion del uso continuo del vehiculo.

- Emotion: Gracias a obtener la emocion del conductor nos es posible predecir un manejo descuidado en el vehiculo.
- Drowsiness: Con este resultado nos es posible valorar si el auto tuvo algun choque, cual fue la razon del mismo.
- Enviroment Sensors: Con estos datos nos es posible saber en que condiciones el conductor expone el vehiculo, asi como mediciones de aceleraciones que sufra el vehiculo, asi como deteccion de choques automatica.

### Emotions Model

Here is a link for the testing training notebook: [CLICK HERE](https://github.com/altaga/Open-Driving-Monitor/blob/main/Emotions/test/Test_Emotions_DNN.ipynb)

<img src="https://i.ibb.co/SVt3wcQ/vlcsnap-2023-11-27-22h52m49s056.png" width="600">

The neural network to detect emotions is a convolutional neural network designed specifically to recognize and classify emotions through images. To perform this task correctly we design the following neural network in tensorflow.

<img src="https://i.ibb.co/wBNZrw2/output-1.png" width="600">

The dataset we used in this training was [FER-2013](https://huggingface.co/spaces/mxz/emtion/resolve/c697775e0adc35a9cec32bd4d3484b5f5a263748/fer2013.csv) which is a dataset with more than 28k images of emotions already classified.

<img src="https://i.ibb.co/PNLpDL2/image.png" width="600">

Already in the notebook we have detailed the entire process of importing the dataset, separating it into Test, Train and Validation subsets, you only have to open the notebook in colab and hit run there to create the model yourself.

<img src="https://i.ibb.co/D55MdD3/New-Project.png" width="600">

### Drowsiness Model:

Here is a link directly to the testing notebook: [CLICK HERE](https://github.com/altaga/Open-Driving-Monitor/blob/main/Drowsiness/test/Test_Blink_DNN.ipynb)

<img src="https://i.ibb.co/MVQfBq2/vlcsnap-2023-11-27-23h13m20s380.png" width="600">

The neural network for detecting eye state is a convolutional neural network specifically designed to recognize a closed eye from an open eye. To perform this task correctly we design the following neural network in tensorflow.

<img src="https://i.ibb.co/9N93ttX/New-Project-3.png" width="600">

The dataset we used in this training was[B-eye](https://github.com/altaga/DBSE-monitor/raw/master/Drowsiness/train/dataset/dataset_B_Eye_Images.zip) which is a dataset with more than 4,800 images of open and closed eyes already classified.

<img src="https://i.ibb.co/R6Vg6HS/image.png" width="600">

Already in the notebook we have detailed the entire process of importing the dataset, separating it into Test, Train and Validation subsets, you only have to open the notebook in colab and hit run there to create the model yourself.

<img src="https://i.ibb.co/VpmMsWr/New-Project-1.png" width="600">

### YoloV3 Model:

Here is a link directly to the testing notebook: [CLICK HERE](./Yolo/test/LoadAndTestYolo.ipynb)

We invite you to open the Notebook and take the test yourself. Nevetheless here we share the test results with you.

<img src="https://i.ibb.co/2c7mHGr/Image.png" width="600">

The model used in the test is the Yolo-Tiny model, because it is the lightest that we can use in this project and its detections are not sufficient for the proper functioning of the project.

### Enviroment Sensors:

Este combo de sensores Bluetooth Low Energy (BLE) se conecta directamente a nuestro modulo AI, el cual manda junto con los resultados de las redes neuronales los datos del sensor a la base de datos.

<img src="https://i.ibb.co/dr5K3Th/image.png" width="600">

Los sensores que nos provee el kit y su utilidad es la siguiente.

- Air Quality: nos provee las condiciones de aire del vehiculo, limpieza del aire acondicionado, humo por cigarro, etc.
- Accelerometer: Este nos provee detalladamente si el auto sufre aceleraciones o desaceleraciones muy bruscas, asi como choques.
- Temperature/Humidity Sensor: nos indica si el vehiculo sufre de temperaturas o humedad inusuales que puedan afectar al interior del vehiculo.
- Luminosity: si el vehiculo es polarizado, nos permite medir si este cumple su funcion correctamente y definir si es un buen valor agregado.
- Barometer: nos permite medir los cambios de presion del vehiculo.

[CODE](./RPi%20Deploy/Sensors/sensors.py)

## Open Driving Marketplace:

Sin embargo todos los datos actualizados continuamente en la blockchain no son utiles si no es posible desplegarlos y verlos de forma sencilla, asi que creamos una progessive web app donde es posible ver los datos de los autos en tiempo real, todo directamente del contrato en polygon.

Open Driving Marketplace: [CLICK HERE](https://open-driving-marketplace.vercel.app/)

<img src="https://i.ibb.co/PgSBppK/image.png" height="300"> <img src="https://i.ibb.co/bRyLDxR/image.png" height="300">

La aplicacion puede funciona correctamente en celular y en navegador, ademas de proveer los datos mas actualizados de los mismos cargados en el smart contract.

<img src="https://i.ibb.co/B4YMrSQ/image.png" width="1000">

[CODE](./Marketplace%20WebPage/)

## Open Driving Navigator (WebPage):

Already having the vehicle data, we create a web platform that allows us to monitor in real time the cars that are sending data to the system. This is in order to prevent accidents and provide more information of the vehicle.

<img src="https://i.ibb.co/pnGjwNy/image.png" width="600">

Open Driving Navigator: [CLICK HERE](https://open-driving-navigator.vercel.app/)

NOTE: the page requires location permissions so that when sending data to the platform we can see the cars appear in our location.

[CODE](./Map%20WebPage/)

# The Final Product:

### Complete System:

<img src="https://i.ibb.co/WsggbsV/20231124-151109.jpg">

### In-car system:

<img src="https://i.ibb.co/Z6nF54M/20231127-132608.png" width="49%"> <img src="https://i.ibb.co/PQm4mGk/20231127-125635.png" width="49%">

# EPIC DEMO:

Video: Click on the image
[![Car](https://i.ibb.co/Vm05pCc/Image.png)](pending...)


# Commentary and final words:



# References:

Links:

(1) https://medlineplus.gov/healthysleep.html

(2) http://www.euro.who.int/__data/assets/pdf_file/0008/114101/E84683.pdf

(3) https://dmv.ny.gov/press-release/press-release-03-09-2018

(4) https://www.nhtsa.gov/risky-driving/drowsy-driving

(5) https://www.nhtsa.gov/risky-driving/speeding

# Table of contents

- [Open Driving Monitor](#open-driving-monitor)
- [Fast Links:](#fast-links)
    - [Video Demo:](#video-demo)
    - [Web Platforms:](#web-platforms)
    - [AI Test Notebooks:](#ai-test-notebooks)
- [Introduction:](#introduction)
- [Problem:](#problem)
- [Solution:](#solution)
  - [Materials:](#materials)
  - [Connection Diagram:](#connection-diagram)
  - [Chainlink Functions:](#chainlink-functions)
    - [Contract:](#contract)
    - [Chainlink Functions Platform:](#chainlink-functions-platform)
  - [AI Models and Sensors:](#ai-models-and-sensors)
    - [Emotions Model](#emotions-model)
    - [Drowsiness Model:](#drowsiness-model)
    - [YoloV3 Model:](#yolov3-model)
    - [Enviroment Sensors:](#enviroment-sensors)
  - [Open Driving Marketplace:](#open-driving-marketplace)
  - [Open Driving Navigator (WebPage):](#open-driving-navigator-webpage)
- [The Final Product:](#the-final-product)
    - [Complete System:](#complete-system)
    - [In-car system:](#in-car-system)
- [EPIC DEMO:](#epic-demo)
- [Commentary and final words:](#commentary-and-final-words)
- [References:](#references)
- [Table of contents](#table-of-contents)
