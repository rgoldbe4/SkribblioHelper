const Eris = require("eris");

var bot = new Eris("");
// Replace BOT_TOKEN with your bot account's token

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
});

bot.on("messageCreate", (msg) => { // When a message is created
    if(msg.content === "!ping") { // If the message content is "!ping"
        bot.createMessage(msg.channel.id, "Pong!");
        // Send a message in the same channel with "Pong!"
    } else if(msg.content === "!pong") { // Otherwise, if the message is "!pong"
        bot.createMessage(msg.channel.id, "Ping!");
        // Respond with "Ping!"
    }
    
    //When the user asks to join a room...
    if (msg.content === "!help") {
        msg.delete();
        bot.createMessage(msg.channel.id, 
            "\n**>>>>** BOT HELP **<<<<**" +
            "\n\n** Your Commands **" +
            "\n`!help` - *shows this message*" +
            "\n`!join` - *joins an open room or creates new room if all full*" +
            "\n`!join <room #>` - *joins a specific room if not full*" +
            "\n\n** Room Commands **" +
            "\n`!start` - *declares a room has started a skribblio game.*" +
            "\n`!end` - *declares a room has ended a skribblio game.*"
        );
    }
});

bot.connect(); // Get the bot to connect to Discord