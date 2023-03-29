const https = require('https');
const { REST, Routes } = require('discord.js');
const cheerio = require('cheerio');

const commands = [
    {
        name: 'lastofus',
        description: 'Sprawdza cene gry Last of Us Part I',
    },
    {
        name: 'd2r',
        description: 'Sprawdza cene gry Diablo 2 Ressurected',
    },
];

const rest = new REST({ version: '10' }).setToken('MTA4OTk3ODYwMzIyNTIzMTM3NA.GhOPDu.gGo6fj2oTAZeVCpOWWQJSLVQ_hmVghynMFYVDU');

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands('1089978603225231374'), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

//------------------------------------------------------------------------------------------------------------------

const { Client, GatewayIntentBits } = require('discord.js');
const { response } = require('express');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'lastofus') {
        const cheerio = require('cheerio');
        const url = "https://gg.deals/game/the-last-of-us-part-i-remake/";

        fetch(url)
            .then(response => response.text())
            .then(html => {
                const $ = cheerio.load(html);
                const parentDiv = $(".load-more-content.shadow-box-big-light");
                const childrenDivs = parentDiv.find(".similar-deals-container.items-with-top-border-desktop");

                let lowestPriceElement = null;

                childrenDivs.each((index, child) => {
                    const priceSpan = $(child).find(".price-inner.game-price-current");
                    if (priceSpan.length > 0) {
                        const price = parseFloat(priceSpan.text().replace(/,/g, '.').replace(/[^\d.]/g, ''));
                        if (lowestPriceElement === null || price < lowestPrice) {
                            lowestPrice = price;
                            lowestPriceElement = priceSpan;
                        }
                    }
                });

                if (lowestPriceElement !== null) {
                    const lowestPriceText = lowestPriceElement.text().trim();
                    interaction.reply(`Najniższa cena jaką znalazłem dla Last Of Us Part I to: ${lowestPriceText}. \n źródło to: https://gg.deals/game/the-last-of-us-part-i-remake/`);
                } else {
                    interaction.reply("Nie mogłem znaleźć żadnych cen, mój twórca zepsuł kod, skontaktuj się z boskim twórcą: 'Yeenc'");
                }

            })
            .catch(error => {
                console.error(`Error fetching ${url}: ${error}`);
            });
    } else if (interaction.commandName === 'd2r') {
        const cheerio = require('cheerio');
        const url = "https://gg.deals/game/diablo-ii-resurrected/";

        fetch(url)
            .then(response => response.text())
            .then(html => {
                const $ = cheerio.load(html);
                const parentDiv = $(".load-more-content.shadow-box-big-light");
                const childrenDivs = parentDiv.find(".similar-deals-container.items-with-top-border-desktop");

                let lowestPriceElement = null;

                childrenDivs.each((index, child) => {
                    const priceSpan = $(child).find(".price-inner.game-price-current");
                    if (priceSpan.length > 0) {
                        const price = parseFloat(priceSpan.text().replace(/,/g, '.').replace(/[^\d.]/g, ''));
                        if (lowestPriceElement === null || price < lowestPrice) {
                            lowestPrice = price;
                            lowestPriceElement = priceSpan;
                        }
                    }
                });

                if (lowestPriceElement !== null) {
                    const lowestPriceText = lowestPriceElement.text().trim();
                    interaction.reply(`Najniższa cena jaką znalazłem to: ${lowestPriceText}. \n źródło to: https://gg.deals/game/diablo-ii-resurrected/`);
                } else {
                    interaction.reply("Nie mogłem znaleźć żadnych cen, mój twórca zepsuł kod, skontaktuj się z boskim twórcą: 'Yeenc'");
                }

            })
            .catch(error => {
                console.error(`Error fetching ${url}: ${error}`);
            });
    }
});
client.login('MTA4OTk3ODYwMzIyNTIzMTM3NA.GhOPDu.gGo6fj2oTAZeVCpOWWQJSLVQ_hmVghynMFYVDU');