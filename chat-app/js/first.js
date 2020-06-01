const GroupForm = document.getElementById('createGroup-form');
const JoinGroupForm = document.getElementById('join-group');



const socket = io();
const username="5ec4083d13be752f745245ba";
// Gat all Groups list and appendd to select options
socket.emit('groups-list');
socket.on('all-groups-list', ({ success, data }) => {
    if(success){
        data.map((group)=>{
            const select = document.getElementById('room');
            var option = document.createElement("option");
            option.value = group.id;
            option.text = group.name;
            select.add(option);
        })
    }
});
// Get room and users
socket.on('add-group-message', ({ success, message }) => {
    console.log(success,message)
});
// Message submit
GroupForm.addEventListener('submit', e => {
    e.preventDefault();
    const groupName = e.target.elements.groupName.value;
    const purpose = e.target.elements.purpose.value;
    socket.emit('add-group', { admin:username, group:groupName , description:purpose});
    // Clear input
    e.target.elements.groupName.value = '';
    e.target.elements.groupName.focus();
});

JoinGroupForm.addEventListener('submit',e=>{
    e.preventDefault();
    const group= e.target.elements.room.value;
    socket.emit('join-group',{username:username,group:group})
})

