const Eris = require("eris");

var bot = new Eris("NjkwMzE2Mjk5Njc0NDUyMDE4.XnPppQ.h_BSeq9fySVMW-16eFgt-5Ywt84");
// Replace BOT_TOKEN with your bot account's token

var roomStatus = [];
var roomHierarchy = [];
let rooms = [];


function updateRoomHierarchy() {
    rooms.forEach(room => {
        //Grab all children rooms.
        bot.guilds.filter(guild => { return guild.name === 'ITSC-2600 Skribblio' })
        .forEach(guild => {
            guild.channels.filter(channel => { return channel.parentID !== null && channel.parentID === room.id }).forEach(channel => {
                roomHierarchy.push({ child: channel, childID: channel.id, parentID: channel.parentID });
            });
        });
    });
}

function updateRooms() {
    bot.guilds.filter(guild => { return guild.name === 'ITSC-2600 Skribblio' })
        .forEach(guild => {
            //Complex: Filter out to all categories, minus the "waiting room"
            rooms = guild.channels.filter(room => { return room.type === 4}).filter(room => { return !room.name.includes("Waiting"); });
        });
}

function updateRoomStatus() {
    rooms.forEach(room => {
        //Complex: Add each room into roomStatus
        roomStatus.push({ room: room, name: room.name, id: room.id, state: false });
    });
}

function createPrivateRoom(authorID) {
    console.log("room is not available");
}

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"

    updateRooms();
    updateRoomStatus();
    updateRoomHierarchy();
    
});


bot.on("messageCreate", (msg) => { 
    
    if (msg.content.includes("!")) {
        if (msg.channel.name === "room-cmds" || msg.channel.name === "chat") {
            if (msg.content === "!help") {
                //Make sure the command is in the correct channel.
                bot.createMessage(msg.channel.id, 
                    "\n**>>>>** BOT HELP **<<<<**" +
                    "\n\n** Your Commands **" +
                    "\n`!help` - *shows this message*" +
                    "\n`!join` - *tells you what rooms are open*" +
                    "\n`!status <room #>` - *checks the current status of the room*" +
                    "\n\n** Room Commands **" +
                    "\n`!game` - *toggles whether a game has started or not*"
                );
            // Try joining a room.
            }
            if (msg.content === "!join") {
                // Get all room status's
                let openRooms = roomStatus;
                if (openRooms.filter(room => { return room.state === false }).length == 0) {
                    bot.createMessage(msg.channel.id, "\n**No rooms are open**");
                } else {
                    let response = "\n\n";
                    openRooms.forEach(room => {
                        response += "\n**" + room.name + " Status**: " + (room.state ? "```CSS\n[In Game]\n```" : "```CSS\n+ Open\n```");
                    });
                    bot.createMessage(msg.channel.id, response);
                }
            }
            // Toggle that a room is starting or stopping.
            if (msg.content === "!game") {
                //First, check if it is a "chat" channel.
                const childRoomsFound = roomHierarchy.filter(room => { return room.child.type === 0 }).filter(room => { return room.childID === msg.channel.id });
                if (childRoomsFound.length == 1) {
                    const childRoom = childRoomsFound[0]; //Always the first.
                    let currentState;
                    //Update the room status.
                    roomStatus.forEach(room => {
                        if (room.id === childRoom.parentID) {
                            room.state = !room.state;
                            currentState = room.state;
                        }
                    });
                    if (currentState === true) {
                        bot.createMessage(msg.channel.id, "\n**Game is starting!** Remember: no one can join your lobby while this is active.");
                    } else {
                        bot.createMessage(msg.channel.id, "**Game is over!** Thank you for playing. If you want to play again, just do `!game`.");
                    }
                } else {
                    bot.createMessage(msg.channel.id, "\nRun this in **#chat** for your room!");
                }
            }
            
            if (msg.content.startsWith("!status")) {
                try {
                    //Grab the room number.
                    const roomNum = Number(msg.content.split(" ")[1]) - 1;
                    if (roomNum < roomStatus.length && roomNum > -1) {
                        const room = roomStatus[roomNum];
                        bot.createMessage(msg.channel.id, "\n**Room #" + (roomNum + 1) + " Status**: " + (room.state ? "```CSS\n[In Game]\n```" : "```CSS\n+ Open\n```"));
                    } else {
                        bot.createMessage(msg.channel.id, "\n**Room #" + (roomNum + 1) + " does not exist!**");
                    }
                    
                } catch (ex) {
                    console.log("Failed to run !status");
                    console.log(ex);
                }
            }
            
            if (msg.content === "!purge") {
                msg.channel.purge();
            }
            
        } else {
            bot.createMessage(msg.channel.id, 
                msg.author.username + ", please use #room-cmds for your command."
            ); 
        }
        
    }
});

bot.connect();