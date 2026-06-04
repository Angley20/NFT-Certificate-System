// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CertificateNFT is ERC721 {

    uint256 public tokenCounter;

    struct Certificate {
        string studentName;
        string courseName;
        string ipfsHash;
        uint256 issueDate;
        bool revoked;
    }

    mapping(uint256 => Certificate) public certificates;

    mapping(address => uint256[]) public studentCertificates;

    address public owner;

    constructor() ERC721("CertificateNFT", "CERT") {
        owner = msg.sender;
        tokenCounter = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function mintCertificate(
        address student,
        string memory studentName,
        string memory courseName,
        string memory ipfsHash
    ) public onlyOwner {

        uint256 tokenId = tokenCounter;

        _safeMint(student, tokenId);

        certificates[tokenId] = Certificate({
            studentName: studentName,
            courseName: courseName,
            ipfsHash: ipfsHash,
            issueDate: block.timestamp,
            revoked: false
        });

        studentCertificates[student].push(tokenId);

        tokenCounter++;
    }

    function revokeCertificate(
        uint256 tokenId
    ) public onlyOwner {
        certificates[tokenId].revoked = true;
    }

    function verifyCertificate(
        uint256 tokenId
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            bool
        )
    {
        Certificate memory cert =
            certificates[tokenId];

        return (
            cert.studentName,
            cert.courseName,
            cert.ipfsHash,
            cert.issueDate,
            cert.revoked
        );
    }

    function getStudentCertificates(
        address student
    )
        public
        view
        returns (uint256[] memory)
    {
        return studentCertificates[student];
    }
}