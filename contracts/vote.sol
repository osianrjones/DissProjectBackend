// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;
pragma experimental SMTChecker;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


interface IVoteToken {
    function mintForUser(address user) external;

    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract Vote {
    
    struct Voter {
        bool voted;
        uint vote;
    }

    struct Proposal {
        bytes32 name;
        uint count;
    }

    mapping(address => Voter) public voters;

    mapping(address => bool) public registered;

    Proposal[] public proposals;

    event Registered(address indexed sender);

    event TokenSent(address indexed reciever);

    IVoteToken public token; //The vote token contract

    string[] public encryptedVotes;

    constructor(bytes32[] memory proposalNames, address tokenAddress) {
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                count: 0
            }));
        }
        token = IVoteToken(tokenAddress);
    } 

   function vote(string memory encryptedVote) external {
    Voter storage sender = voters[msg.sender];
    require(!sender.voted, "User has voted already.");

    uint256 previousLength = encryptedVotes.length;
    encryptedVotes.push(encryptedVote);
    assert(encryptedVotes.length == previousLength + 1);

    sender.voted = true;
    assert(sender.voted == true);

    bool success = token.transferFrom(msg.sender, address(this), 1);
    assert(success);
    require(success, "Transfer failed.");
}


    function winningProposal() public view returns (bytes32) {
        require(proposals.length > 0, "There are no proposals in the contract.");
        uint winningCount = 0;
        uint winningIndex = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].count > winningCount) {
                winningCount = proposals[i].count;
                winningIndex = i;
            }
        }
        return proposals[winningIndex].name;
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    function getAllEncryptedVotes() public view returns (string[] memory) {
        return encryptedVotes;
    }

    function register() external payable {
        require(!registered[msg.sender], "User already registered");

        registered[msg.sender] = true;
        emit Registered(msg.sender);

        token.mintForUser(msg.sender);
        emit TokenSent(msg.sender);
    }

    function hasRegistered(address _address) public view returns(bool) {
        return registered[_address];
    }

}