"use client";
import { Contract, providers } from "ethers";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { abi } from "../../contracts/nft";
import MyHeader from "../../components/myHeader";

const contractAddress = "0x90455e269083d6344f9fE1f38695ca47D7149078";

function ipfsToHttp(url) {
  const CID = url.split("/")[2];
  return `https://${CID}.ipfs.nftstorage.link/${url.split("/")[3]}`;
}

function explorerURL(owner) {
  return `https://polygonscan.com/token/${contractAddress}?a=${owner}`;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function MainPage() {
  // Consts
  const searchParams = useSearchParams();
  // Ethers
  const provider = useMemo(
    () => new providers.JsonRpcProvider("https://polygon.meowrpc.com/"),
    []
  );
  const nftContract = useMemo(
    () => new Contract(contractAddress, abi, provider),
    [provider]
  );
  // Id

  // States
  const [carUri, setCarUri] = useState("");
  const [carData, setCarData] = useState({});
  const [carId, setCarId] = useState("");

  // Funtions

  const isObjectEmpty = (objectName) => {
    return Object.keys(objectName).length === 0;
  };

  const getURI = useCallback(async () => {
    const uri = await nftContract.tokenURI(carId);
    setCarUri(uri);
  }, [carId, nftContract]);

  const getData = useCallback(async () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const data = await new Promise((resolve) => {
      fetch(ipfsToHttp(carUri), requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          const owner = await nftContract.ownerOf(carId);
          resolve({
            ...result,
            owner: owner,
          });
        });
    });
    setCarData(data);
  }, [carUri, carId, nftContract]);

  const getId = useCallback(async () => {
    const id = searchParams.get("id");
    setCarId(id);
  }, [searchParams]);

  // ComponentDidUpdate (if count changes)

  useEffect(() => {
    if (carUri) {
      getData();
    }
  }, [carUri, getData]);

  useEffect(() => {
    if (carId) {
      getURI();
    }
  }, [carId, getURI]);

  // ComponentDidMount

  useEffect(() => {
    if (searchParams) {
      getId();
    }
  }, [searchParams, getId]);

  if (isMobile) {
    return (
      <>
        <MyHeader />
        <div className="containerPageMobile">
          {!isObjectEmpty(carData) ? (
            <div className="carPageCardMobile">
              <img
                width={"100%"}
                height={"100%"}
                style={{
                  maxHeight: "20vh",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
                src={ipfsToHttp(carData.image)}
                alt="car"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div
                style={{
                  color: "#6076b7",
                  fontSize: "1.2rem",
                  marginTop: "5px",
                }}
              >
                Vehicle Model
              </div>
              <div
                style={{
                  color: "black",
                  fontSize: "1.3rem",
                  marginBottom: "20px",
                }}
              >
                {carData.name}
              </div>
              <div
                style={{
                  color: "#6076b7",
                  fontSize: "1.2rem",
                  marginTop: "5px",
                }}
              >
                Description
              </div>
              <div
                style={{
                  color: "black",
                  fontSize: "1.3rem",
                  marginBottom: "20px",
                }}
              >
                {carData.description}
              </div>
              <div
                style={{
                  color: "#6076b7",
                  fontSize: "1.2rem",
                  marginTop: "5px",
                }}
              >
                Owner
              </div>
              <Link
                href={explorerURL(carData.owner)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  style={{
                    color: "black",
                    fontSize: "1.3rem",
                    marginBottom: "20px",
                    wordBreak: "break-word",
                  }}
                >
                  {carData.owner.substring(0, 10)}
                  {"..."}
                  {carData.owner.substring(
                    carData.owner.length - 10,
                    carData.owner.length
                  )}
                </div>
              </Link>
              {carData.attributes !== undefined &&
                carData.attributes.length > 0 && (
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    {carData.attributes.map((attribute, index) => {
                      if (attribute.trait_type === "Mileage") {
                        return (
                          <div
                            key={attribute.trait_type + index}
                            style={{ color: "black" }}
                          >
                            <div
                              style={{
                                color: "#6076b7",
                                fontSize: "1.2rem",
                                marginTop: "5px",
                              }}
                            >
                              Mileage
                            </div>
                            <div
                              style={{
                                color: "black",
                                fontSize: "1.3rem",
                                marginBottom: "20px",
                              }}
                            >
                              {attribute.value} miles
                            </div>
                          </div>
                        );
                      } else if (attribute.trait_type === "Software") {
                        return (
                          <div
                            key={attribute.trait_type + index}
                            style={{ color: "black" }}
                          >
                            <div
                              style={{
                                color: "#6076b7",
                                fontSize: "1.2rem",
                                marginTop: "5px",
                              }}
                            >
                              Software
                            </div>
                            <div
                              style={{
                                color: "black",
                                fontSize: "1.3rem",
                                marginBottom: "20px",
                              }}
                            >
                              {attribute.value}
                            </div>
                          </div>
                        );
                      } else if (attribute.trait_type === "Sales") {
                        return (
                          <div
                            key={attribute.trait_type + index}
                            style={{ color: "black" }}
                          >
                            <div
                              style={{
                                color: "#6076b7",
                                fontSize: "1.2rem",
                                marginTop: "5px",
                              }}
                            >
                              Past Sales
                            </div>
                            <div
                              style={{
                                color: "black",
                                fontSize: "1.3rem",
                                marginBottom: "20px",
                              }}
                            >
                              {!isObjectEmpty(attribute.value) &&
                                Object.keys(attribute.value).map(
                                  (key, index) => {
                                    return (
                                      <div key={key + index}>
                                        {key} - ${attribute.value[key]}
                                      </div>
                                    );
                                  }
                                )}
                            </div>
                          </div>
                        );
                      } else if (attribute.trait_type === "Service") {
                        return (
                          <div
                            key={attribute.trait_type + index}
                            style={{ color: "black" }}
                          >
                            <div
                              style={{
                                color: "#6076b7",
                                fontSize: "1.2rem",
                                marginTop: "5px",
                              }}
                            >
                              Service Records
                            </div>
                            <div
                              style={{
                                color: "black",
                                fontSize: "1rem",
                                marginBottom: "20px",
                              }}
                            >
                              {!isObjectEmpty(attribute.value) &&
                              Object.keys(attribute.value).length > 0 ? (
                                Object.keys(attribute.value).map(
                                  (key, index) => {
                                    return (
                                      <div key={key + index}>
                                        {key} / {attribute.value[key]}
                                      </div>
                                    );
                                  }
                                )
                              ) : (
                                <div
                                  style={{
                                    color: "black",
                                    fontSize: "1rem",
                                  }}
                                >
                                  No service records
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      } else if (attribute.trait_type === "Accident") {
                        return (
                          <div
                            key={attribute.trait_type + index}
                            style={{ color: "black" }}
                          >
                            <div
                              style={{
                                color: "#6076b7",
                                fontSize: "1.2rem",
                                marginTop: "5px",
                              }}
                            >
                              Accident Reports
                            </div>
                            <div
                              style={{
                                color: "black",
                                fontSize: "1rem",
                                marginBottom: "20px",
                              }}
                            >
                              {!isObjectEmpty(attribute.value) &&
                              Object.keys(attribute.value).length > 0 ? (
                                Object.keys(attribute.value).map(
                                  (key, index) => {
                                    return (
                                      <div key={key + index}>
                                        {key} / {attribute.value[key]}
                                      </div>
                                    );
                                  }
                                )
                              ) : (
                                <div
                                  style={{
                                    color: "black",
                                    fontSize: "1rem",
                                  }}
                                >
                                  No accident reports
                                </div>
                              )}
                            </div>
                          </div>
                        ); 
                      } else {
                        return <Fragment key={"Nothing" + index} />;
                      }
                    })}
                  </div>
                )}
              {carData.attributes !== undefined &&
                carData.attributes.length > 0 &&
                carData.attributes.some(
                  (attribute) => attribute.trait_type === "Last Update"
                ) &&
                carData.attributes.map((attribute, index) => {
                  if (attribute.trait_type === "Last Update") {
                    return (
                      <div
                        key={attribute.trait_type + index}
                        style={{ color: "black" }}
                      >
                        <div
                          style={{
                            color: "#6076b7",
                            fontSize: "1.2rem",
                            marginTop: "5px",
                          }}
                        >
                          Last Update
                        </div>
                        <div
                          style={{
                            color: "black",
                            fontSize: "1.3rem",
                            marginBottom: "20px",
                          }}
                        >
                          {new Date(attribute.value).toLocaleString()}
                        </div>
                      </div>
                    );
                  } else if (attribute.trait_type === "Location") {
                    return (
                      <div
                        key={attribute.trait_type + index}
                        style={{ color: "black" }}
                      >
                        <div
                          style={{
                            color: "#6076b7",
                            fontSize: "1.2rem",
                            marginTop: "5px",
                          }}
                        >
                          Location
                        </div>
                        <div
                          style={{
                            color: "black",
                            fontSize: "1.3rem",
                            marginBottom: "20px",
                          }}
                        >
                          {attribute.value}
                        </div>
                      </div>
                    );
                  } else if (attribute.trait_type === "Eye Status") {
                    return (
                      <div
                        key={attribute.trait_type + index}
                        style={{ color: "black" }}
                      >
                        <div
                          style={{
                            color: "#6076b7",
                            fontSize: "1.2rem",
                            marginTop: "5px",
                          }}
                        >
                          Attention
                        </div>
                        <div
                          style={{
                            color: "black",
                            fontSize: "1.3rem",
                            marginBottom: "20px",
                          }}
                        >
                          {attribute.trait_type === "Eye Status" &&
                            (attribute.value
                              ? "Driver Awake"
                              : "Driver Drowsy")}
                        </div>
                      </div>
                    );
                  } else if (attribute.trait_type === "Emotion") {
                    return (
                      <div
                        key={attribute.trait_type + index}
                        style={{ color: "black" }}
                      >
                        <div
                          style={{
                            color: "#6076b7",
                            fontSize: "1.2rem",
                            marginTop: "5px",
                          }}
                        >
                          Emotion
                        </div>
                        <div
                          style={{
                            color: "black",
                            fontSize: "1.3rem",
                            marginBottom: "20px",
                          }}
                        >
                          {attribute.value}
                        </div>
                      </div>
                    );
                  } else if (attribute.trait_type === "Environment") {
                    return (
                      <div
                        key={attribute.trait_type + index}
                        style={{ color: "black" }}
                      >
                        <div
                          style={{
                            color: "#6076b7",
                            fontSize: "1.2rem",
                            marginTop: "5px",
                          }}
                        >
                          Environment
                        </div>
                        {Object.keys(attribute.value).map((keys, index2) => {
                          if (index2 < 5) {
                            return (
                              <div
                                style={{
                                  color: "black",
                                  textAlign: "left",
                                }}
                                key={keys + index2}
                              >
                                <div
                                  style={{
                                    fontSize: "1.3rem",
                                    margin: "10px 0px",
                                  }}
                                >
                                  {`• ${capitalizeFirstLetter(keys)} - ${
                                    attribute.value[keys]
                                  } `}
                                  {keys === "temperature" && "°C"}
                                  {keys === "humidity" && "%"}
                                  {keys === "light" && "lux"}
                                  {keys === "pressure" && "Pa"}
                                  {keys === "airq" && "ppm"}
                                </div>
                              </div>
                            );
                          } else {
                            return <Fragment key={"Nothing" + index2} />;
                          }
                        })}
                      </div>
                    );
                  } else {
                    return <Fragment key={"Nothing" + index} />;
                  }
                })}
            </div>
          ) : (
            <h3 style={{ color: "white" }}>Loading...</h3>
          )}
        </div>
      </>
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
      <>
        <MyHeader />
        <div className="containerPage">
          <div
            style={{
              width: "100%",
              flexDirection: "row",
              display: "flex",
              ...scrollbarStyle,
            }}
          >
            {!isObjectEmpty(carData) ? (
              <div className="carPageCard">
                <div
                  style={{
                    width: "50%",
                    paddingRight: "20px",
                    borderRight: "1px solid black",
                  }}
                >
                  <img
                    width="100%"
                    height="auto"
                    style={{
                      maxHeight: "50vh",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                    src={ipfsToHttp(carData.image)}
                    alt="car"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div
                    style={{
                      color: "#6076b7",
                      fontSize: "0.9rem",
                      marginTop: "5px",
                    }}
                  >
                    Vehicle Model
                  </div>
                  <div
                    style={{
                      color: "black",
                      fontSize: "1rem",
                      marginBottom: "10px",
                    }}
                  >
                    {carData.name}
                  </div>
                  <div
                    style={{
                      color: "#6076b7",
                      fontSize: "0.9rem",
                      marginTop: "5px",
                    }}
                  >
                    Description
                  </div>
                  <div
                    style={{
                      color: "black",
                      fontSize: "1rem",
                      marginBottom: "10px",
                    }}
                  >
                    {carData.description}
                  </div>
                  <div
                    style={{
                      color: "#6076b7",
                      fontSize: "0.9rem",
                      marginTop: "5px",
                    }}
                  >
                    Owner
                  </div>
                  <Link
                    href={explorerURL(carData.owner)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div
                      style={{
                        color: "black",
                        fontSize: "1rem",
                        marginBottom: "10px",
                        wordBreak: "break-word",
                      }}
                    >
                      {carData.owner.substring(0, 10)}
                      {"..."}
                      {carData.owner.substring(
                        carData.owner.length - 10,
                        carData.owner.length
                      )}
                    </div>
                  </Link>
                </div>
                {carData.attributes !== undefined &&
                  carData.attributes.length > 0 && (
                    <div
                      style={{
                        width: "25%",
                        paddingLeft: "20px",
                      }}
                    >
                      {carData.attributes.map((attribute, index) => {
                        if (attribute.trait_type === "Mileage") {
                          return (
                            <div
                              key={attribute.trait_type + index}
                              style={{ color: "black" }}
                            >
                              <div
                                style={{
                                  color: "#6076b7",
                                  fontSize: "0.9rem",
                                  marginTop: "5px",
                                }}
                              >
                                Mileage
                              </div>
                              <div
                                style={{
                                  color: "black",
                                  fontSize: "1rem",
                                  marginBottom: "20px",
                                }}
                              >
                                {attribute.value} miles
                              </div>
                            </div>
                          );
                        } else if (attribute.trait_type === "Software") {
                          return (
                            <div
                              key={attribute.trait_type + index}
                              style={{ color: "black" }}
                            >
                              <div
                                style={{
                                  color: "#6076b7",
                                  fontSize: "0.9rem",
                                  marginTop: "5px",
                                }}
                              >
                                Software
                              </div>
                              <div
                                style={{
                                  color: "black",
                                  fontSize: "1rem",
                                  marginBottom: "20px",
                                }}
                              >
                                {attribute.value}
                              </div>
                            </div>
                          );
                        } else if (attribute.trait_type === "Sales") {
                          return (
                            <div
                              key={attribute.trait_type + index}
                              style={{ color: "black" }}
                            >
                              <div
                                style={{
                                  color: "#6076b7",
                                  fontSize: "0.9rem",
                                  marginTop: "5px",
                                }}
                              >
                                Past Sales
                              </div>
                              <div
                                style={{
                                  color: "black",
                                  fontSize: "1rem",
                                  marginBottom: "20px",
                                }}
                              >
                                {!isObjectEmpty(attribute.value) &&
                                  Object.keys(attribute.value).map(
                                    (key, index) => {
                                      return (
                                        <div
                                          key={key + index}
                                          style={{
                                            color: "black",
                                            fontSize: "1rem",
                                          }}
                                        >
                                          {key} - ${attribute.value[key]}
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            </div>
                          );
                        } else if (attribute.trait_type === "Service") {
                          return (
                            <div
                              key={attribute.trait_type + index}
                              style={{ color: "black" }}
                            >
                              <div
                                style={{
                                  color: "#6076b7",
                                  fontSize: "0.9rem",
                                  marginTop: "5px",
                                }}
                              >
                                Service Records
                              </div>
                              <div
                                style={{
                                  color: "black",
                                  fontSize: "1rem",
                                  marginBottom: "20px",
                                }}
                              >
                                {!isObjectEmpty(attribute.value) &&
                                Object.keys(attribute.value).length > 0 ? (
                                  Object.keys(attribute.value).map(
                                    (key, index) => {
                                      return (
                                        <div
                                          key={key + index}
                                          style={{
                                            color: "black",
                                            fontSize: "1rem",
                                          }}
                                        >
                                          {key} / {attribute.value[key]}
                                        </div>
                                      );
                                    }
                                  )
                                ) : (
                                  <div
                                    style={{
                                      color: "black",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    No service records
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        } else if (attribute.trait_type === "Accident") {
                          return (
                            <div
                              key={attribute.trait_type + index}
                              style={{ color: "black" }}
                            >
                              <div
                                style={{
                                  color: "#6076b7",
                                  fontSize: "0.9rem",
                                  marginTop: "5px",
                                }}
                              >
                                Accident Reports
                              </div>
                              <div
                                style={{
                                  color: "black",
                                  fontSize: "1rem",
                                  marginBottom: "20px",
                                }}
                              >
                                {!isObjectEmpty(attribute.value) &&
                                Object.keys(attribute.value).length > 0 ? (
                                  Object.keys(attribute.value).map(
                                    (key, index) => {
                                      return (
                                        <div
                                          key={key + index}
                                          style={{
                                            color: "black",
                                            fontSize: "1rem",
                                          }}
                                        >
                                          {key} / {attribute.value[key]}
                                        </div>
                                      );
                                    }
                                  )
                                ) : (
                                  <div
                                    style={{
                                      color: "black",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    No accident reports
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        } else {
                          return <Fragment key={"Nothing" + index} />;
                        }
                      })}
                    </div>
                  )}
                {carData.attributes !== undefined &&
                  carData.attributes.length > 0 &&
                  carData.attributes.some(
                    (attribute) => attribute.trait_type === "Last Update"
                  ) && (
                    <div
                      style={{
                        width: "25%",
                        paddingLeft: "20px",
                        borderLeft: "1px solid black",
                      }}
                    >
                      {carData.attributes.map((attribute, index) => {
                        if (attribute.trait_type === "Last Update") {
                          return (
                            <div
                              key={attribute.trait_type + index}
                              style={{ color: "black" }}
                            >
                              <div
                                style={{
                                  color: "#6076b7",
                                  fontSize: "0.9rem",
                                  marginTop: "5px",
                                }}
                              >
                                Last Update
                              </div>
                              <div
                                style={{
                                  color: "black",
                                  fontSize: "1rem",
                                  marginBottom: "20px",
                                }}
                              >
                                {new Date(attribute.value).toLocaleString()}
                              </div>
                            </div>
                          );
                        } else if (attribute.trait_type === "Location") {
                          return (
                            <div
                              key={attribute.trait_type + index}
                              style={{ color: "black" }}
                            >
                              <div
                                style={{
                                  color: "#6076b7",
                                  fontSize: "0.9rem",
                                  marginTop: "5px",
                                }}
                              >
                                Location
                              </div>
                              <div
                                style={{
                                  color: "black",
                                  fontSize: "1rem",
                                  marginBottom: "20px",
                                }}
                              >
                                {attribute.value}
                              </div>
                            </div>
                          );
                        } else if (attribute.trait_type === "Eye Status") {
                          return (
                            <div
                              key={attribute.trait_type + index}
                              style={{ color: "black" }}
                            >
                              <div
                                style={{
                                  color: "#6076b7",
                                  fontSize: "0.9rem",
                                  marginTop: "5px",
                                }}
                              >
                                Attention
                              </div>
                              <div
                                style={{
                                  color: "black",
                                  fontSize: "1rem",
                                  marginBottom: "20px",
                                }}
                              >
                                {attribute.trait_type === "Eye Status" &&
                                  (attribute.value
                                    ? "Driver Awake"
                                    : "Driver Drowsy")}
                              </div>
                            </div>
                          );
                        } else if (attribute.trait_type === "Emotion") {
                          return (
                            <div
                              key={attribute.trait_type + index}
                              style={{ color: "black" }}
                            >
                              <div
                                style={{
                                  color: "#6076b7",
                                  fontSize: "0.9rem",
                                  marginTop: "5px",
                                }}
                              >
                                Emotion
                              </div>
                              <div
                                style={{
                                  color: "black",
                                  fontSize: "1rem",
                                  marginBottom: "20px",
                                }}
                              >
                                {attribute.value}
                              </div>
                            </div>
                          );
                        } else if (attribute.trait_type === "Environment") {
                          return (
                            <div
                              key={attribute.trait_type + index}
                              style={{ color: "black" }}
                            >
                              <div
                                style={{
                                  color: "#6076b7",
                                  fontSize: "0.9rem",
                                  marginTop: "5px",
                                }}
                              >
                                Environment
                              </div>
                              {Object.keys(attribute.value).map(
                                (keys, index2) => {
                                  if (index2 < 5) {
                                    return (
                                      <div
                                        style={{
                                          color: "black",
                                          textAlign: "left",
                                        }}
                                        key={keys + index2}
                                      >
                                        <div
                                          style={{
                                            fontSize: "1rem",
                                            margin: "10px 0px",
                                          }}
                                        >
                                          {`• ${capitalizeFirstLetter(
                                            keys
                                          )} - ${attribute.value[keys]} `}
                                          {keys === "temperature" && "°C"}
                                          {keys === "humidity" && "%"}
                                          {keys === "light" && "lux"}
                                          {keys === "pressure" && "Pa"}
                                          {keys === "airq" && "ppm"}
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <Fragment key={"Nothing" + index2} />
                                    );
                                  }
                                }
                              )}
                            </div>
                          );
                        } else {
                          return <Fragment key={"Nothing" + index} />;
                        }
                      })}
                    </div>
                  )}
              </div>
            ) : (
              <h3 style={{ color: "black" }}>Loading...</h3>
            )}
          </div>
        </div>
      </>
    );
  }
}
