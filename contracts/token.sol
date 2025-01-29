// Token.sol
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VoteToken is ERC20 {

    address public registrationContract;

    constructor(uint256 initialSupply, address _registrationContract) ERC20("VoteToken", "VTK") {
        _mint(msg.sender, initialSupply);
        registrationContract = _registrationContract;
    }

    modifier onlyRegistrationContract() {
        require(msg.sender == registrationContract, "Not authorized");
        _;
    }
    
    function setRegistrationContract(address _registrationContract) external {
        require(registrationContract == address(0), "Registration Contract already set");
        registrationContract = _registrationContract;
    }

    function mintForUser(address user) external onlyRegistrationContract {
        _mint(user, 1 * 10 ** decimals());
    }
}
