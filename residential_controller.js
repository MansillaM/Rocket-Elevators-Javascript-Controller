import { isEmpty } from "lodash";

//Set my variables
let elevatorID = 1
let floorRequestButtonID = 1
let callButtonID = 1
 
let column = 1
console.log(column)

class Column {
    constructor(_id, _status, _amountOfFloors, _amountOfElevators) {
        this.id = _id;
        this.status = _status;
        this.elevatorList = [];
        this.callButtonList = [];

        this.createElevators(_amountOfFloors, _amountOfElevators);
        this.createCallButtons(_amountOfFloors);
        this.requestElevator();
        this.findElevator();
        this.checkIfElevatorIsBetter();

    };

    createCallButtons(_amountOfFloors){
        let buttonFloor = 1;
           
        for (let i = 1; i = _amountOfFloors; ++i){
            //If it's not the last floor
            if (buttonFloor < _amountOfFloors){
                let callButton = new CallButton(i, 'off', buttonFloor, 'up');
                this.callButtonList.push(callButton);
                ++callButtonID;
            }
            
            //If it's not the first floor
            if (buttonFloor > 1){
                let callButton = new CallButton(i, 'off', buttonFloor ,'down');
                this.callButtonList.push(callButton);
                ++callButtonID;
            }
            ++buttonFloor;
            
        }     
    }

    createElevators(_amountOfFloors, _amountOfElevators){
        for (let i = 1; i = _amountOfElevators; ++i){
            Elevator = new Elevator(i, 'idle', _amountOfFloors, 1);
            this.elevatorList.push(Elevator);
            ++elevatorID;   
        }
    }

    //Simulate when a user press a button outside the elevator
    requestElevator(floor, direction){
        let elevator = this.findElevator(floor, direction);
        elevator.floorRequestList.push(floor);
        Elevator.move();
        Elevator.operateDoors();
        return Elevator;
    }

    //We use a score system depending on the current elevators state. Since the bestScore and the referenceGap are 
    //higher values than what could be possibly calculated, the first elevator will always become the default bestElevator, 
    //before being compared with to other elevators. If two elevators get the same score, the nearest one is prioritized.
    findElevator(requestedFloor, requestedDirection){
        let bestElevator = this.findElevator();
        bestScore = 5;
        referenceGap = 10000;
        let bestElevatorInformations;

            for (let i = 0; i < this.elevatorList.length; i++){
            //The elevator is at my floor and going in the direction I want
                if (requestedFloor == Elevator.currentFloor && Elevator.status == 'stopped' && requestedDirection == Elevator.direction){
                    bestElevatorInformations = this.checkIfElevatorIsBetter(1, 'elevator', bestScore, referenceGap, bestElevator, requestedFloor);
            //The elevator is lower than me, is coming up and I want to go up
                }else if (requestedFloor > Elevator.currentFloor && Elevator.direction == 'up' && requestedDirection == Elevator.direction){
                    bestElevatorInformations = this.checkIfElevatorIsBetter(2, 'elevator', bestScore, referenceGap, bestElevator, requestedFloor);
            //The elevator is higher than me, is coming down and I want to go down
                }else if (requestedFloor < Elevator.currentFloor && Elevator.direction == 'down' && requestedDirection == Elevator.direction){
                    bestElevatorInformations = this.checkIfElevatorIsBetter(2, 'elevator', bestScore, referenceGap, bestElevator, requestedFloor);
            //The elevator is idle
                }else if (Elevator.status = 'idle'){
                    bestElevatorInformations = this.checkIfElevatorIsBetter(3, 'elevator', bestScore, referenceGap, bestElevator, requestedFloor);
            //The elevator is not available, but still could take the call if nothing better is found
                }else{
                bestElevatorInformations = this.checkIfElevatorIsBetter(3, 'elevator', bestScore, referenceGap, bestElevator, requestedFloor);
            }    
            let bestElevator = bestElevatorInformations.bestElevator;
            let bestScore = bestElevatorInformations.bestScore;
            let referenceGap = bestElevatorInformations.referenceGap;
        }
        return bestElevator;
    }

    checkIfElevatorIsBetter(scoreToCheck, newElevator, bestScore, referenceGap, bestElevator, floor){
        if (scoreToCheck < bestScore){
            bestScore = scoreToCheck;
            bestElevator = newElevator;
            referenceGap = Math.abs(newElevator.currentFloor - floor)
        } else if (bestScore == scoreToCheck){
            let gap = Math.abs(newElevator.currentFloor - floor);
            if(referenceGap > gap){
                bestElevator = newElevator;
                referenceGap = gap;
            }
        }
        return bestElevatorInformations(bestElevator, bestScore, referenceGap)
    }
}//END of Column


class Elevator {
    constructor(_id, _status, _amountOfFloors, _currentFloor) {
        this.id = _id;
        this.status = _status;
        this.currentFloor = _currentFloor;
        this.direction = null;
        this.door = new Door(_id, 'closed');
        this.floorRequestsButtonsList = [];
        this.floorRequestList = []
        
        this.createFloorRequestButtons(_amountOfFloors);
        this.requestFloor(floor);
        this.move();
        this.sortFloorList();
        this.operateDoors();
    }
    
    createFloorRequestButtons(_amountOfFloors){
        let buttonFloor = 1;

        for (let i = 1; i = _amountOfFloors; i++){
            let floorRequestButton = new FloorRequestButton(floorRequestButtonID, 'off', buttonFloor);
            this.floorRequestsButtonsList.push(floorRequestButton)
            ++buttonFloor;
            ++floorRequestButtonID;
        }
    }

    //Simulate when a user press a button inside the elevator
    requestFloor(floor){
        this.floorRequestList.push(floor);
        this.move();
        this.operateDoors();
    }

    move(){
        while (this.floorRequestList != isEmpty){
            let destination = this.floorRequestList[0];
            this.status = 'moving';
        
            if (this.currentFloor < destination){
                this.direction = 'up';
                this.sortFloorList();
            
                while (this.currentFloor < destination){
                    ++this.currentFloor;
                    this.screenDisplay = this._currentFloor;
                }
            }else if (this.currentFloor > destination){
                this.direction = 'down';
                 this.sortFloorList();
                while (this.currentFloor > destination)
                 --this.currentFloor;
                this.screenDisplay = this.currentFloor;
            }
            this.status = 'opened';
            this.floorRequestList.shift()        
        }
        this.status = 'idle';
    }

    sortFloorList(){
        if (this.direction == 'up'){
            this.floorRequestList(function(a, b){return a - b});
        } else {
            this.floorRequestList(function(a, b){return b - a});
        }
    }

    operateDoors(){
        this.door.status = 'opened';
        setTimeout(function(){
            if (this.door != 'overweight'){
                this.door.status = 'closing';
                if (!obstruction){
                    this.door.status = 'closing';
                }else{
                    this.operateDoors()
                }
            }else{
                while (this.door = 'overweight'){
                console.log('Activate overweight alarm')
                }
                this.operateDoors();
            }

        },5000);
    }   
}//END OF ELEVATOR  

class CallButton {
    constructor(_id, _status, _floor, _direction) {
        this.id = _id;
        this.status = _status;
        this.floor = _floor;
        this.direction = _direction;

    }
}

class FloorRequestButton {
    constructor(_id, _status, _floor) {
        this.id = _id;
        this.status = _status;
        this.floor = _floor;
    }
}

class Door {
    constructor(_id, _status) {
        this.id = _id;
        this.status = _status;
    }
}





module.exports = { Column, Elevator, CallButton, FloorRequestButton, Door }
