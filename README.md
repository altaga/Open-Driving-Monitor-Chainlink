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

# Inspiration:

Approximately a month or so ago we saw in chainlinks official X.com a post where there was an idea for dynamic NFTs that could serve as a way to valuate property or physical goods such as sneakers, homes or cars that employed IoT sensors that fed data through Chainlink oracles and functions to those NFTs.

<img src="https://i.ibb.co/sjB72SV/dnfts.png">


# Solution:

We built a platform powered by Chainlink and AI models that is able to continuously monitor the environment of vehicles and with this information generate a dNFT sales token on the Polygon network.

<img src="https://i.ibb.co/B4YMrSQ/image.png" width="1000">

In addition to a hardware system that is responsible for running the AI models and obtaining data from the sensors.

<img src="https://i.ibb.co/WGzFdvm/hardware-1.png" width="600">

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
  - Chainlink Functions: The new chainlink functions are used to be able to make API Calls to our Off-Chain API and update the metadata of each of the dNFTs when required.

  - Polygon: This network is used as it is one of the networks compatible with Chainlink Functions and its low gas fees.

  - IPFS: We use the NFT.Storage IPFS services to store the metadata of the NFTs and images.

- Off-Chain:
  - AWS DynamoDB: In this database we update the values of the sensors and the data obtained from the AI services continuously.
    
  - AWS IoT: We use this service to communicate securely between the sensors and the AI module to the cloud.
    
  - AWS API Gateway: We use this service as the main API to be called by Chainlink Functions.

- Sensors:

  - NXP Rapid IoT Prototyping: This sensor kit allows us to measure many aspects of the car and with that data we can generate a better report on its conditions and its value over time.

- AI Module:
  - Eye State Detection: Through preprocessing in OpenCV haarcascades, OpenCV DNN and a frozen graph inference model (Tensor Flow), we obtain the driver's state of attention and drowsiness.. [Details](#drowsiness-model-training)
    
  - Emotions Identification: Through preprocessing in OpenCV haarcascades, OpenCV DNN and a frozen graph inference model (Tensor Flow), we obtain the driver's mood.[Details](#emotions-model-training)

  - YoloV3: Using OpenCV DNN and the famous network [YoloV3 from Darknet](https://pjreddie.com/darknet/) We carry out the identification of vehicles and pedestrians in the blind spot of the car. [Details](#yolov3-model-testing)

- Online Platforms:
  - Open Driving Monitor: Using a board enabled with OpenCV DNN, we created a system that can run the 3 AI models and also provide vehicle GPS information at all times. The selected board will be shown later. [Details](#board-setup)

  - Open Driving Navigator: Using the NextJS, Open Layers and Vercel framework, we create a map that allows us to display the cars that are on our platform in real time and their states.. [Details](#open-driving-navigator-webpage)

## Chainlink Functions:

For our project it is essential that the data of each of the cars registered as dNFTs is updated, however performing this update is a complicated technical problem. For this, thanks to the Chainlink functions and its new [Decentralized Oracle Network (DON)](https://docs.chain.link/chainlink-functions/resources/concepts) they allow computing API calls and providing the smart contracts with that information through a subscription model on the ChainLink platform.

<img src="https://i.ibb.co/zPwcVdJ/software-Chainlink-Only-drawio.png" width="1000">

### Contract:

The contract that we have on the blockchain for this entire project has the following code.

[dNFT Contract](./Contracts/OpenDrivingNFT.sol)

The first thing we did was implement the Chainlink Functions modules in the ERC721 contract.

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

Once this is done, we modify the **sendRequest** function to make an API Call to the AWS API Gateway, where the API returns the most up-to-date metadata of the car in the form of an IPFS URI.

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

The second function to modify was **fulfillRequest** since upon receiving the new URI it had to be able to update the URI associated with the token.

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

Now that all the functions have been implemented correctly, all that remains is to deploy the contract. But something else was missing, we had to make our contract able to consume the function on Chainlink, so we had to create a subscription at https://functions.chain.link.

<img src="https://i.ibb.co/vdLhMts/image.png" width="600">

Although it is a very simple process, we found the following message when trying to fund our subscription.

<img src="https://i.ibb.co/y8J8WbQ/Screenshot-2023-12-07-150720.png" width="600">

This was a surprise for us because we already had LINK in our wallet, however in the wallet section we found the problem.

<img src="https://i.ibb.co/Y8sdGww/Screenshot-2023-12-07-150930.png" width="600">

So all that was necessary to do was perform the LINK swap on the page https://pegswap.chain.link/.

<img src="https://i.ibb.co/t8Gmg07/Screenshot-2023-12-07-150913.png" width="600">

Once the swap was made it was possible to fund our subscription.

<img src="https://i.ibb.co/5WN600v/Screenshot-2023-12-07-151247-Copy.png" width="600">

And finally we just had to add our contract as a consumer of the subscription.

<img src="https://i.ibb.co/pwjTY0J/Screenshot-2023-12-07-151317.png" width="600">

Once this was done and we called the **sendRequest** function from our contract, we could see how chainlink received the request and provided us with the data in the contract a few seconds later.

<img src="https://i.ibb.co/yq151CV/Screenshot-2023-12-07-155947.png" width="600">

## AI Models and Sensors:

The purpose of all these models and sensors in the project is to provide added value by being able to measure the car in real time, making it possible to make a better assessment of the continuous use of the vehicle.

- Emotion: Thanks to obtaining the driver's emotion it is possible for us to predict careless handling of the vehicle.
- Drowsiness: With this result it is possible for us to assess if the car had a crash, what was the reason for it.
- Environment Sensors: With this data it is possible for us to know under what conditions the driver exposes the vehicle, as well as measurements of accelerations suffered by the vehicle, as well as automatic crash detection.

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

This Bluetooth Low Energy (BLE) sensor kit connects directly to our AI module, which sends the sensor data to the database along with the results of the neural networks.

<img src="https://i.ibb.co/dr5K3Th/image.png" width="600">

The sensors that the kit provides us and their usefulness are as follows.

- Air Quality: provides us with the air conditions of the vehicle, cleanliness of the air conditioning, cigarette smoke, etc.
- Accelerometer: This provides us in detail if the car suffers very sudden accelerations or decelerations, as well as crashes.
- Temperature/Humidity Sensor: tells us if the vehicle suffers from unusual temperatures or humidity that could affect the interior of the vehicle.
- Luminosity: if the vehicle is tinted, it allows us to measure if it fulfills its function correctly and define if it is a good added value.
- Barometer: allows us to measure the pressure changes in the vehicle.
  
[CODE](./RPi%20Deploy/Sensors/sensors.py)

## Open Driving Marketplace:

However, all the continuously updated data on the blockchain is not useful if it is not possible to display and view it easily, so we created a progressive web app where it is possible to view the car data in real time, all directly from the contract in polygon. .

Open Driving Marketplace: [CLICK HERE](https://open-driving-marketplace.vercel.app/)

<img src="https://i.ibb.co/PgSBppK/image.png" height="300"> <img src="https://i.ibb.co/bRyLDxR/image.png" height="300">

The application can work correctly on cell phones and in browsers, in addition to providing the most up-to-date data uploaded to the smart contract.

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

<img src="https://i.ibb.co/WGzFdvm/hardware-1.png">

### In-car system:

<img src="https://i.ibb.co/Z6nF54M/20231127-132608.png" width="49%"> <img src="https://i.ibb.co/PQm4mGk/20231127-125635.png" width="49%">

# EPIC DEMO:

Video: Click on the image
[![Car](https://i.ibb.co/Vm05pCc/Image.png)](pending...)


# Commentary and final words:

We think we accomplished what we wanted to do wwhich was bringing the dNFT idea we saw, into a real dNFT platform with real sensors and the blockchain backend with Chainlink functions that we wanted to try out.
Of course this is just a functional PoC, but it serves as a blueprint of how these kind of solutions would be built. We still need to improve the front end of it to make it more comprehensive, but all the backend functionality works better than expected even with the AI aspects of it. 
Hopefully you liked the project, thanks for reading.

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
