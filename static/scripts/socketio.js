document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io();

    let room = "Lounge";
    joinRoom("Lounge"); 


    
    // incoming messages 
     socket.on ('message', data => {
        const p = document.createElement ('p');
        const span_username = document.createElement('span');
        const span_timestamp = document.createElement('span');
        const br = document.createElement ('br'); 
        
        if (data.username) {
            span_username.innerHTML = data.username;
            span_timestamp.innerHTML = data.time_stamp; 
            p.innerHTML = span_username.outerHTML + br.outerHTML + data.msg + br.outerHTML + span_timestamp.outerHTML; 
            document.querySelector('#display-message-section').append(p);
        } else {
            printSysMsg(data.msg);
        }
        
    });

    // send message 
    document.querySelector('#send_message').onclick = () => {
        socket.send({'msg': document.querySelector('#user_message').value,'username': username, 'room': room });

        document.querySelector('#user_message').value = '';
    };

    //room select
    document.querySelectorAll('.select-room').forEach(p => {
        p.onclick = () => {
            let newRoom = p.innerHTML;
            if (newRoom == room) {
                msg = `You are already in ${room} room. `
                printSysMsg(msg);
            } else {
                leaveRoom(room);
                joinRoom(newRoom);
                room = newRoom;
            }
        }
    });

    //leave room
    function leaveRoom(room) {
        socket.emit('leave', {'username': username, 'room': room});
    }

    //join room
    function joinRoom(room) {
        socket.emit('join', {'username': username, 'room': room});
        // wipe message area
        document.querySelector('#display-message-section').innerHTML= ''
    }

    //system messages
    function printSysMsg(msg) {
        const p = document.createElement('p');
        p.innerHTML = msg;
        document.querySelector('#display-message-section').append(p);

    }

})