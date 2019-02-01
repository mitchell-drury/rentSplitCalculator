function eventListeners() {
    document.getElementById('percentCommonSpace').oninput = function() {
        displayPercent();
        calculate();
    }
    document.getElementById('totalRent').oninput = function(event) {
        sqrftInput(event);
    }
    document.getElementById('totalRent').onkeyup = function(event) {
        keyUpHandler(event);
    }

    let rooms = document.getElementsByClassName('sqrft')
    for (let i=0; i<rooms.length; i++) {
        rooms[i].oninput = function() {
            this.style.border = '.5px solid grey';
            calculate();
        }
        rooms[i].onkeyup = function() {
            keyUpHandler(event);
        }
    }

    document.getElementById('addButton').onclick = function() {
        let roomNumber = document.getElementsByClassName('sqrft').length + 1;
        let newRoom = "<tr class='room'><td>" + roomNumber + "</td><td><input id='room" + roomNumber + "' class='sqrft' type='text' size='5' maxlength='4' oninput='sqrftInput(event)' onkeyup='keyUpHandler(event)'></td><td id='room" + roomNumber + "Cost' class='roomCost'></td><td class='delete' onclick='deleteRoom(event)'></td></tr>"

        $(newRoom).insertBefore('#addButton');
        calculate();
    }

    let deleteButtons = document.getElementsByClassName('delete');
    for(let i=0; i<deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', function(event){deleteRoom(event)});
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
        } else {
            sqrft[i].style.border = '.5px solid red';
        }
        numberOfRooms += 1;
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

function sqrftInput(event) {
    event.target.style.border = '1px solid black';
    calculate();
}

function deleteRoom(event) {
    let roomToDelete = parseInt(($(event.target).parent().children().first().html()));
    $(event.target).parent().remove();
    let rooms = document.getElementsByClassName('room');
    let roomNumber;
    for (let i=0; i<rooms.length; i++) {
        roomNumber = parseInt($(rooms[i]).children().first().html());
        if (roomNumber > roomToDelete) {
            $(rooms[i]).children().first().html(roomNumber-1);
            $(rooms[i]).children(":nth-child(2)").children().first().attr("id", "room" + (roomNumber-1));
            $(rooms[i]).children(":nth-child(3)").attr("id", "room" + (roomNumber-1) + "Cost");
            
        }
    }
    calculate();
}

function keyUpHandler(event) {
    let nextRoom;
    if (event.which === 13) {
        if (event.target.id === 'totalRent') {
            $("input.sqrft").first().focus();
        } else {
            let rooms = document.getElementsByClassName('room');
            nextRoom = parseInt(event.target.id.substring(4)) + 1;
            if (nextRoom <= rooms.length) {
                $("#room" + nextRoom).focus();
            } else {
                event.target.blur();
            }
        }
    }
}