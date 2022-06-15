//import { isEmpty } from "lodash";

//Set my variables
let elevatorID = 1
let floorRequestButtonID = 1
let callButtonID = 1



class Column {
    constructor(_id, _amountOfFloors, _amountOfElevators) {
        //console.log("creating column with " + _amountOfElevators + " elevators.")
        this.ID = _id;
        this.status = 'active';
        this.elevatorList = [];
        this.callButtonList = [];

        this.createElevators(_amountOfFloors, _amountOfElevators);
        this.createCallButtons(_amountOfFloors);
    };

    createCallButtons(_amountOfFloors) {
        //console.log(1);
        let buttonFloor = 1;

        for (let i = 0; i < _amountOfFloors; i++) {
            //If it's not the last floor
            if (buttonFloor < _amountOfFloors) {
                let callButton = new CallButton(callButtonID, buttonFloor, 1);
                this.callButtonList.push(callButton);
                callButtonID++;
            }

            //If it's not the first floor
            if (buttonFloor > 1) {
                let callButton = new CallButton(callButtonID, buttonFloor, 1);
                this.callButtonList.push(callButton);
                callButtonID++;

            }
            buttonFloor++;
        }
    }

    createElevators(_amountOfFloors, _amountOfElevators) {
        //console.log(2)
        //console.log("creating " + _amountOfElevators + " elevators.")
        for (let i = 0; i < _amountOfElevators; i++) {
            let elevator = new Elevator(elevatorID, _amountOfFloors);
            this.elevatorList.push(elevator);
            elevatorID++;
        }
    }

    //Simulate when a user press a button outside the elevator
    requestElevator(requestedFloor, direction) {

        let elevator = this.findElevator(requestedFloor, direction)
        console.log("REUEST ELEVATOR")
        elevator.floorRequestList.push(requestedFloor)
        elevator.move()
        elevator.operateDoors()
        return elevator
    };

    //We use a score system depending on the current elevators state. Since the bestScore and the referenceGap are 
    //higher values than what could be possibly calculated, the first elevator will always become the default bestElevator, 
    //before being compared with to other elevators. If two elevators get the same score, the nearest one is prioritized.
    findElevator(requestedFloor, requestedDirection) {
        let bestElevator
        let bestScore = 5
        let referenceGap = 10000000
        let bestElevatorInformations;

        for (let i = 0; i < this.elevatorList.length; i++) {
            let elevator = this.elevatorList[i];
            //The elevator is at my floor and going in the direction I want
            if (requestedFloor == elevator.currentFloor && elevator.status == 'stopped' && requestedDirection == elevator.direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(1, elevator, bestScore, referenceGap, bestElevator, requestedFloor);
                //The elevator is lower than me, is coming up and I want to go up
            } else if (requestedFloor > elevator.currentFloor && elevator.direction == 'up' && requestedDirection == elevator.direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(2, elevator, bestScore, referenceGap, bestElevator, requestedFloor);
                //The elevator is higher than me, is coming down and I want to go down
            } else if (requestedFloor < elevator.currentFloor && elevator.direction == 'down' && requestedDirection == elevator.direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(2, elevator, bestScore, referenceGap, bestElevator, requestedFloor);
                //The elevator is idle
            } else if (elevator.status == 'idle') {
                bestElevatorInformations = this.checkIfElevatorIsBetter(3, elevator, bestScore, referenceGap, bestElevator, requestedFloor)
                //The elevator is not available, but still could take the call if nothing better is found
            } else {
                bestElevatorInformations = this.checkIfElevatorIsBetter(4, elevator, bestScore, referenceGap, bestElevator, requestedFloor)
            }
            bestElevator = bestElevatorInformations.bestElevator;
            bestScore = bestElevatorInformations.bestScore;
            referenceGap = bestElevatorInformations.referenceGap;
        }
        console.log(bestElevator instanceof Elevator);
        return bestElevator
    }

    checkIfElevatorIsBetter(scoreToCheck, newElevator, bestScore, referenceGap, bestElevator, floor) {
        
        if (scoreToCheck < bestScore) {
            bestScore = scoreToCheck;
            bestElevator = newElevator;
            referenceGap = Math.abs(newElevator.currentFloor - floor)
        } else if (bestScore == scoreToCheck) {
            let gap = Math.abs(newElevator.currentFloor - floor);
            if (referenceGap > gap) {
                bestElevator = newElevator;
                referenceGap = gap;
            }
        }

        return {
            bestScore,
            referenceGap,
            bestElevator,
        }
    }


}//END of Column


class Elevator {
    constructor(_id, _amountOfFloors) {
        this.ID = _id;
        this.status = 'idle';
        this.currentFloor = 1;
        this.direction = null;
        this.door = new Door(_id, 'closed');
        this.floorRequestButtonList = [];
        this.floorRequestList = []

        this.createFloorRequestButtons(_amountOfFloors);
    }

    createFloorRequestButtons(_amountOfFloors) {
        //console.log(6);
        let buttonFloor = 1;

        for (let i = 0; i < _amountOfFloors; i++) {
            let floorRequestButton = new FloorRequestButton(floorRequestButtonID, 'off', buttonFloor);
            this.floorRequestButtonList.push(floorRequestButton)
            buttonFloor++;
            floorRequestButtonID++;
        }
    }

    //Simulate when a user press a button inside the elevator
    requestFloor(requestedFloor) {
        //console.log(7);
        this.floorRequestList.push(requestedFloor);
        this.sortFloorList;
        this.move();
        this.operateDoors();
    }

    move() {
        //console.log(8);
        while (this.floorRequestList.length != 0) {
            let destination = this.floorRequestList[0];
            this.status = 'moving';
            if (this.currentFloor < destination) {
                this.direction = 'up';
                while (this.currentFloor < destination) {
                    this.currentFloor++;
                }
            } else if (this.currentFloor > destination) {
                this.direction = 'down';
                while (this.currentFloor > destination) {
                    this.currentFloor--;
                }
            }
            this.status = 'opened';
            this.floorRequestList.shift()
        }
        this.status = 'idle';
    }

    sortFloorList() {
        //console.log(9);
        if (this.direction == 'up') {
            this.floorRequestList(function (a, b) { return a - b });
        } else {
            this.floorRequestList(function (a, b) { return b - a });
        }
    }

    operateDoors() {
        //console.log(10);
        if (this.door.status == 'opened') {
            this.door.status = 'closed';
        } else if (this.door.status == 'closed')
            this.door.status = 'opened';
    }
    //this.door.status = 'opened';
    // setTimeout(function(){
    //     if (this.door != 'overweight'){
    //         this.door.status = 'closing';
    //         if (false){
    //         //this.door.status = 'closing';
    //         }else{
    //             this.operateDoors()
    //         }
    //     }else{
    //         while (this.door === 'overweight'){
    //         console.log('Activate overweight alarm')
    //         }
    //         this.operateDoors();
    //     }

    // },5000);
}
//}//END OF ELEVATOR  

class CallButton {
    constructor(_id, _floor, _direction) {
        this.ID = _id;
        this.status = 'active';
        this.floor = _floor;
        this.direction = _direction;

    }
}

class FloorRequestButton {
    constructor(_id, _floor) {
        this.ID = _id;
        this.status = 'active';
        this.floor = _floor;
    }
}

class Door {
    constructor(_id) {
        this.ID = _id;
        this.status = 'active';
    }
}

//let column = new Column(1, 10, 2)



module.exports = { Column, Elevator, CallButton, FloorRequestButton, Door }
