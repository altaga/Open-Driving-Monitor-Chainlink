"use client";
import { Contract, providers } from "ethers";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { abi } from "../contracts/nft";

const contractAddress = "0x90455e269083d6344f9fE1f38695ca47D7149078";

function ipfsToHttp(url) {
  const CID = url.split("/")[2];
  return `https://${CID}.ipfs.nftstorage.link/${url.split("/")[3]}`;
}

function explorerURL(owner) {
  return `https://polygonscan.com/token/${contractAddress}?a=${owner}`;
}

export default function MainPage() {
  // Consts and States
  const provider = useMemo(
    () => new providers.JsonRpcProvider("https://polygon.meowrpc.com/"),
    []
  );
  const nftContract = useMemo(
    () => new Contract(contractAddress, abi, provider),
    [provider]
  );

  const [cars, setCars] = useState([]);
  const [carsData, setCarsData] = useState([]);

  // Funtions

  async function getURIs() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("/api/getFullDB", requestOptions)
      .then((response) => response.json())
      .then((result) => setCars(result.result))
      .catch(() => setCars([]));
  }

  const getDatas = useCallback(
    async (array) => {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const data = await Promise.all(
        array.map((uri, index) => {
          return new Promise((resolve) => {
            fetch(ipfsToHttp(uri), requestOptions)
              .then((response) => response.json())
              .then(async (result) => {
                const owner = await nftContract.ownerOf(index + 1);
                resolve({
                  ...result,
                  owner: owner,
                });
              });
          });
        })
      );
      setCarsData(data);
    },
    [nftContract]
  );
  // ComponentDidUpdate (if count changes)

  useEffect(() => {
    getDatas(cars);
  }, [cars, getDatas]);

  // ComponentDidMount
  useEffect(() => {
    getURIs();
  }, []);

  if (isMobile) {
    const scrollbarStyle = {
      // Hide the scrollbar
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      "&::WebkitScrollbar": {
        width: "0",
        height: "0",
      },
      // Optional: Add some padding to the scrollable element
      paddingRight: "10px",
    };
    return (
      <div className="containerMobile">
        <div style={{ position: "absolute", top: "11vh" }}>
          <Link
            href={`https://polygonscan.com/token/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white" }}
          >
            <h1 style={{ textAlign: "center" }}>
              dNFT Car Collection
            </h1>
          </Link>
        </div>
        <div style={{ marginTop: "10vh" }} />
        <div
          style={{
            overflowX: "scroll",
            width: "100%",
            flexDirection: "row",
            display: "flex",
            ...scrollbarStyle,
          }}
        >
          {carsData.length > 0 ? (
            carsData.map((car, index) => (
              <div key={"car" + index} className="carCardMobile">
              <div style={{ width: "80vw" }}></div>
              <img
                width={"100%"}
                height={"100%"}
                  style={{
                    maxHeight: "20vh",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                  src={ipfsToHttp(car.image)}
                  alt="car"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              <div
                style={{
                  color: "#6076b7",
                  fontSize: "1.1rem",
                  marginTop: "5px",
                }}
              >
                Vehicle Model
              </div>
              <div
                style={{
                  color: "black",
                  fontSize: "1.2rem",
                  marginBottom: "10px",
                }}
              >
                {car.name}
              </div>
              <div
                style={{
                  color: "#6076b7",
                  fontSize: "1.1rem",
                  marginTop: "5px",
                }}
              >
                Description
              </div>
              <div
                style={{
                  color: "black",
                  fontSize: "1.2rem",
                  marginBottom: "10px",
                }}
              >
                {car.description}
              </div>
              <div
                style={{
                  color: "#6076b7",
                  fontSize: "1.1rem",
                  marginTop: "5px",
                }}
              >
                Owner
              </div>
              <Link
                href={explorerURL(car.owner)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  style={{
                    color: "black",
                    fontSize: "1.2rem",
                    marginBottom: "10px",
                    wordBreak: "break-word",
                  }}
                >
                  {car.owner.substring(0, 10)}
                  {"..."}
                  {car.owner.substring(
                    car.owner.length - 10,
                    car.owner.length
                  )}
                </div>
              </Link>
              <div
                style={{
                  color: "#6076b7",
                  fontSize: "1.1rem",
                  marginTop: "5px",
                }}
              >
                Details
              </div>
              <Link
                href={"/car?id=" + (index + 1).toString()}
                target="_blank"
                rel="noopener noreferrer" 
              >
                <div
                  style={{
                    color: "black",
                    fontSize: "1.2rem",
                    marginBottom: "10px",
                    wordBreak: "break-word",
                  }}
                >
                  Show Details
                </div>
              </Link>
            </div>
            ))
          ) : (
            <h3 style={{ color: "black" }}>Loading...</h3>
          )}
        </div>
      </div>
    );
  } else {
    const scrollbarStyle = {
      // Track
      "&::WebkitScrollbarTrack": {
        background: "#f1f1f1",
      },
      // Handle
      "&::WebkitScrollbarThumb": {
        background: "#888",
        borderRadius: "4px",
      },
      // Handle on hover
      "&::WebkitScrollbarThumb:hover": {
        background: "#555",
      },
      // Reduce size
      "&::WebkitScrollbar": {
        width: "8px",
        borderRadius: "4px",
      },
    };

    return (
      <div className="container">
        <div style={{ position: "absolute", top: "11vh" }}>
          <Link
            href={`https://polygonscan.com/token/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white" }}
          >
            <h1> dNFT Car Collection</h1>
          </Link>
        </div>
        <div
          style={{
            overflowX: "scroll",
            width: "100%",
            flexDirection: "row",
            display: "flex",
            ...scrollbarStyle,
          }}
        >
          {carsData.length > 0 ? (
            carsData.map((car, index) => (
              <div key={"car" + index} className="carCard">
                <div style={{ width: "30vw" }}></div>
                <Link
                  href={"/car?id=" + (index + 1).toString()}
                  target="_blank"
                  rel="noopener noreferrer" 
                >
                  <img
                    width={"100%"}
                    height={"100%"}
                      style={{
                        maxHeight: "25vh",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    src={ipfsToHttp(car.image)}
                    alt="car"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </Link>
                <div
                  style={{
                    color: "#6076b7",
                    fontSize: "0.8rem",
                    marginTop: "5px",
                  }}
                >
                  Vehicle Model
                </div>
                <div
                  style={{
                    color: "black",
                    fontSize: "0.9rem",
                    marginBottom: "10px",
                  }}
                >
                  {car.name}
                </div>
                <div
                  style={{
                    color: "#6076b7",
                    fontSize: "0.8rem",
                    marginTop: "5px",
                  }}
                >
                  Description
                </div>
                <div
                  style={{
                    color: "black",
                    fontSize: "0.9rem",
                    marginBottom: "10px",
                  }}
                >
                  {car.description}
                </div>
                <div
                  style={{
                    color: "#6076b7",
                    fontSize: "0.8rem",
                    marginTop: "5px",
                  }}
                >
                  Owner
                </div>
                <Link
                  href={explorerURL(car.owner)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    style={{
                      color: "black",
                      fontSize: "0.9rem",
                      marginBottom: "10px",
                      wordBreak: "break-word",
                    }}
                  >
                    {car.owner.substring(0, 10)}
                    {"..."}
                    {car.owner.substring(
                      car.owner.length - 10,
                      car.owner.length
                    )}
                  </div>
                </Link>
                <div
                style={{
                  color: "#6076b7",
                  fontSize: "0.8rem",
                  marginTop: "5px",
                }}
              >
                Details
              </div>
              <Link
                href={"/car?id=" + (index + 1).toString()}
                target="_blank"
                rel="noopener noreferrer" 
              >
                <div
                  style={{
                    color: "black",
                    fontSize: "0.9rem",
                    marginBottom: "10px",
                    wordBreak: "break-word",
                  }}
                >
                  Show Details
                </div>
              </Link>
              </div>
            ))
          ) : (
            <h3 style={{ color: "black" }}>Loading...</h3>
          )}
        </div>
      </div>
    );
  } 
}
