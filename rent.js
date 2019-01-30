function eventListeners() {
    document.getElementById('percentCommonSpace').oninput = function() {
        displayPercent();
        calculate();
    }
    document.getElementById('totalRent').oninput = function() {
        this.style.border = '1px solid black';
        calculate();
    }

    let rooms = document.getElementsByClassName('sqrft')
    for (let i=0; i<rooms.length; i++) {
        rooms[i].oninput = function() {
            this.style.border = '.5px solid grey';
            calculate();
        }
    }
}

function displayPercent() {
    document.getElementById('percentDisplay').innerHTML = document.getElementById('percentCommonSpace').value;
}

function calculate() {
    let totalRent = parseInt(document.getElementById('totalRent').value);   
    let percentCommonSpace = parseInt(document.getElementById('percentCommonSpace').value)/100;
    let numberOfRooms = 0;

    if(isNaN(totalRent)) {
        document.getElementById('totalRent').style.border='1px solid red';
        let roomCosts = document.getElementsByClassName('roomCost');
        for (let i=0; i<roomCosts.length; i++) {
            roomCosts[i].innerHTML = '';
        }
        return;
    }

    let sqrft = document.getElementsByClassName('sqrft');
    let totalsqrft = 0;
    for (let i=0; i<sqrft.length; i++) {
        if (!isNaN(parseInt(sqrft[i].value))) {
            totalsqrft += parseInt(sqrft[i].value);
            numberOfRooms += 1;
        } else {
            sqrft[i].style.border = '.5px solid red';
        }
    }

    for (let i=0; i<sqrft.length; i++) {
        let percentRoom = parseInt(sqrft[i].value)/totalsqrft || 0;
        let roomCost = calculateRoomCost(percentRoom, percentCommonSpace, totalRent, numberOfRooms);
        document.getElementById(sqrft[i].id + 'Cost').innerHTML = roomCost;
    }

}

function calculateRoomCost(percentRoom, percentCommonSpace, totalRent, numberOfRooms) {
    return ((totalRent*percentCommonSpace)/numberOfRooms + totalRent*(1-percentCommonSpace)*percentRoom).toFixed(2);
}