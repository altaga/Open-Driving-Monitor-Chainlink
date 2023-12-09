// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ODMContractNFT is
    ERC721URIStorage,
    ConfirmedOwner,
    FunctionsClient,
    ReentrancyGuard
{
    // NFT Vars
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public lastTokenId;
    string public lastURI;

    // Chainlink
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 private s_lastRequestId;
    bytes private s_lastResponse;
    bytes private s_lastError;

    error UnexpectedRequestID(bytes32 requestId);
    event Response(
        bytes32 indexed requestId,
        string lastTokenId,
        bytes response,
        bytes err
    );

    address router = 0x9f82a6A0758517FD0AfA463820F586999AF314a0; // Router
    string source =
        "const car = args[0];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://w98h2gvtv6.execute-api.us-east-1.amazonaws.com/get-db?id=${car}`"
        "});"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "return Functions.encodeString(data.uri);";
    uint32 gasLimit = 300000;
    bytes32 donID =
        0x66756e2d6176616c616e6368652d6d61696e6e65742d31000000000000000000;

    constructor(string memory _uri)
        ERC721("ODM NFT", "ODM")
        FunctionsClient(router)
        ConfirmedOwner(msg.sender)
    {
        mint(_uri, msg.sender);
    }

    function mint(string memory _uri, address _driver) public onlyOwner {
        _mint(_driver, _tokenIds.current());
        _setTokenURI(_tokenIds.current(), _uri);
        _tokenIds.increment();
    }

    function totalContent() public view virtual returns (uint256) {
        return _tokenIds.current();
    }

    // Chainlink

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

    // Fix Utility

    function newURI(uint256 _tokenId, string memory _newuri) public onlyOwner {
        _setTokenURI(_tokenId, _newuri);
    }

    function changeSource(string memory _source) public onlyOwner {
        source = _source;
    }

    // Utils

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }

        uint256 temp = value;
        uint256 digits;

        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer = new bytes(digits);

        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }

        return string(buffer);
    }

    // withdraw native tokens on contract
    function garbage() public onlyOwner nonReentrant {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
