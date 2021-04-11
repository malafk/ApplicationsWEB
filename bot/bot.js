const Discord = require('discord.js');
const fetch = require('node-fetch')
let bot = new Discord.Client();

const prefix = process.env.BOT_PREFIX


bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity("applications by Mal#0221", { type: 'WATCHING' });
});

bot.on('message', message => {
    if (message.author.bot) return;

    const teamrole = message.member.roles.cache.find(r => r.id === process.env.RECRUITMENT_TEAM_ROLE)

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(1).trim().split(" ");
    const command = args.shift().toLowerCase();
    if(command === "questions") {
        if(teamrole) {
            if(args.length < 1) {
                noArgs(message, `questions <add, remove, list>`)
            } else {
                if(args.length == 1) {
                    switch(args[0]) {
                        case "add":
                            let questionText = "";
                            let questionID = 0;
                            let required = true;
                            //shit code leaveme alone
                            message.reply("What will the question id be?")
                            message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 30000}).then(collected => {
                                    questionID = collected.first().content.toLowerCase();
                                    message.channel.send("Okay the id of this question is now set to `" + questionID + "`")
                                message.reply("What will the question be?")
                                message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 30000}).then(collected => {
                                    questionText = collected.first().content.toLowerCase();
                                    message.channel.send("Okay the question has been set to `" + questionText + "`")
                                    message.reply("Is it this question required? (true or false)")
                                    message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 30000}).then(collected => {
                                        required = collected.first().content.toLowerCase();
                                        if(required.includes("true") || required.includes("false")) {
                                            message.channel.send("Okay `" + questionText + "`")
                                            process.DB.get('questions').push({id: questionID, questiontxt: questionText, required: required}).write();
                                            message.channel.send("Done, saved the question by the id: `" + questionID + "`")
                                        } else {
                                            message.channel.send("That was not a true or false answer. Cancelling.")
                                            return;
                                        }
                                    })
                                })
                            })
                            break;
                        case "remove":
                            message.channel.send("remove")
                            break;
                        case "list":

                            let limit = 10;
                            let index = 0;
                            let out = '```diff\n';

                            if(process.DB.get('questions').size().value() <=0) {
                                message.channel.send("There arent any questions set.")
                            }

                            let embed = new Discord.MessageEmbed()
                                .setTitle("Questions")
                                .setColor("RANDOM")
                            process.DB.get('questions').value().forEach(question => {
                                if(index < limit){
                                    embed.addField(`${question.id}`, `
                                    Text: **${question.questiontxt}**
                                    Required: **${question.required}** 
                                    `)
                                    index++;
                                }
                            });

                            message.channel.send({embed})
                            break;
                        default:
                            noArgs(message, `questions <add, remove, list>`)
                    }
                }
            }
        } else {
            noPermission(message);
        }
    }

});

function noPermission(message) {
    let Embed = new Discord.MessageEmbed()
        .setTitle("No Permission")
        .setColor(0xFF0000)
        .setDescription("You do not have the permission for that command")
    message.channel.send(Embed)
}

function noArgs(message, usage) {
    let Embed = new Discord.MessageEmbed()
        .setTitle("Invalid Arguments")
        .setColor(0xFF0000)
        .setDescription("Usage: ." + usage)
    message.channel.send(Embed)
}

module.exports = bot;