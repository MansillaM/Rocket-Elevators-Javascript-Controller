# Rocket-Elevators-Javascript-Controller
# Description

In thi code we will simulate an elevator going through different floors and picking the best option depending on the floor you are on.

We create a Column Class and gather information to create floors and amount of elevators. From here we create call buttons, the elevators themself and a way to find the best elevator for your situation(floor ur on, where is the elevator and if it's moving or not).

We also create an Elevator Class to set it's properties and methods to identfy the elevator. We make methods for the elevator like create floor buttons, request buttons and a move method to move the elevator.

And with all that we also create Classes for CallButton, FloorRequestButton and Dorr to identy them properly

# Dependencies

We need these methods to get the elevator moving and chosing the best elevator.

-createCallButtons create call buttons with floors
-createElevators create elevators and set id, floors
-requestElevator create request based on the floor requested and direction
-findElevator find best elevator depending on where the elevator is, what it is doing and where it's going.
-checkIfElevatorIsBetter make sure we pick the best elevator
-createFloorRequestButtons create call buttons basicaly
-move make the elevator move and change direction and floor
-sortFloorList sort the list numericaly or reversed
-operateDoors open close doors


# Usage

To use this code you have to close the repo, open it in a code editor and run on terminal the test file.

## Example

If I call an elevator from the 1 first floor and theres is 2 elevator( one which is on the last on and the other on the second), the second elevator will get the call because it is closer to the floor of the button call.
