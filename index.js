require("./other/patchConsoleLog");
console.info("[BİLGİ] Basit Altyapı v1.9.4 - by Kıraç Armağan Önal");
const config = require("./config");
globalThis.Underline = config.globalObjects;
const Discord = require("discord.js");
const chillout = require("chillout");
const path = require("path");
const readdirRecursive = require("recursive-readdir");
const {makeSureFolderExists} = require("stuffs");
const client = new Discord.Client(config.clientOptions);
const interactions = new Discord.Collection();
const events = new Discord.Collection();
let interactionFiles;
let eventFiles;
globalThis.Underline = {
    ...config.globalObjects,
    config,
    client,
    interactions,
    events,
    Interaction: require('./types/Interaction'),
    Event: require('./types/Event'),
    SlashCommand: require("./types/SlashCommand"),
    MessageAction: require("./types/MessageAction"),
    UserAction: require("./types/UserAction"),
    SelectMenu: require("./types/SelectMenu"),
    Button: require("./types/Button"),
}

async function getEventFilePaths() {
    let eventsPath = path.resolve("./events");
    await makeSureFolderExists(eventsPath);
    let VEventFiles = await readdirRecursive(eventsPath);
    VEventFiles = VEventFiles.filter(i => {
        let state = path.basename(i).startsWith("-");
        return !state;
    });
    return VEventFiles;
}

async function getInteractionFilePaths() {
    let interactionsPath = path.resolve("./interactions");
    await makeSureFolderExists(interactionsPath);
    let VInteractionFiles = await readdirRecursive(interactionsPath);
    VInteractionFiles = VInteractionFiles.filter(i => {
        let state = path.basename(i).startsWith("-");
        return !state;
    });
    return VInteractionFiles;
}

/** @type {{name:string,listener:()=>any,base:any}[]} */
let eventListeners = [];

async function load() {
    let loadStart = Date.now();
    console.debug(`[HATA AYIKLAMA] Yüklemeye başlandı!`);

    interactionFiles = await getInteractionFilePaths();
    await chillout.forEach(interactionFiles, (interactionFile) => {
        let start = Date.now();
        let rltPath = path.relative(__dirname, interactionFile);
        console.info(`[BİLGİ] "${rltPath}" konumundaki interaksiyon yükleniyor..`)
        /** @type {import("./types/Interaction")} */
        let uInter = require(interactionFile);

        if (!(uInter?._type === "interaction") && !(uInter?._type == "noDeployInteraction")) {
            console.warn(`[UYARI] "${rltPath}" interaksiyon dosyası boş. Atlanıyor..`);
            return;
        }

        if (!uInter.id) {
            console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasının bir idsi bulunmuyor. Atlanıyor..`);
            return;
        }

        if (uInter.name.length > 3) {
            console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasının isim listesi çok uzun. (>3) Atlanıyor..`);
            return;
        }

        if (!uInter.name?.length) {
            console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasının bir ismi bulunmuyor. Atlanıyor..`);
            return;
        }

        if (Underline.interactions.has(uInter.id)) {
            console.warn(`[UYARI] "${uInter.id}" idli bir interaksiyon daha önceden zaten yüklenmiş. Atlanıyor.`)
            return;
        }

        if (typeof uInter.onInteraction != "function") {
            console.error(`[HATA] "${rltPath}" interaksiyon dosyası geçerli bir onInteraction fonksiyonuna sahip değil! Atlanıyor.`);
            return;
        }

        uInter.calculated = {
            developerOnly: false,
            guildOwnerOnly: false
        }

        if (uInter.developerOnly) {
            uInter.calculated.developerOnly = true;
            console.warn(`[UYARI] "${uInter.id}" idli interaksiyon'da developerOnly seçeneğini kullanmışsınız, bu seçenek ilerki sürümlerde kaldırılacaktır lütfen bunu yapmak yerine perms.user kısmına "DEVELOPER"'ı koyunuz.`)
        }

        {
            let devOnlyIndex = uInter.perms.user.findIndex(p => !(p != "DEVELOPER"));
            if (devOnlyIndex > -1) {
                uInter.calculated.developerOnly = true;
                uInter.perms.user.splice(devOnlyIndex, 1);
            }

            let gOwnerOnlyIndex = uInter.perms.user.findIndex(p => !(p != "GUILD_OWNER"));
            if (gOwnerOnlyIndex > -1) {
                uInter.calculated.guildOwnerOnly = true;
                uInter.perms.user.splice(gOwnerOnlyIndex, 1);
            }
        }

        if (!uInter.guildOnly && (!(uInter.perms.bot.length == 0 && uInter.perms.user.length == 0))) {
            console.warn(`[UYARI] "${rltPath}" interaksiyon dosyası sunuculara özel olmamasına rağmen özel perm kullanıyor.`);
        }

        if (!uInter.guildOnly && uInter.calculated.guildOwnerOnly) {
            console.error(`[HATA] "${rltPath}" interaksiyon dosyası sunuculara özel olmamasına rağmen sunucu sahibine özel! Atlanıyor.`);
            return;
        }

        Underline.interactions.set(uInter.id, uInter);
        uInter.onLoad(client);
        console.info(`[BİLGİ] "${(uInter.actionType != "CHAT_INPUT" ? `${uInter.name[0]}` : `/${uInter.name.join(" ")}`)}" (${uInter.id}) adlı interaksiyon yüklendi. (${Date.now() - start}ms sürdü.)`);
    });

    if (Underline.interactions.size) {
        console.info(`[BİLGİ] ${Underline.interactions.size} interaksiyon yüklendi.`);
    } else {
        console.warn(`[UYARI] Hiçbir interaksiyon yüklenmedi, herşey yolunda mı?`);
    }

    eventFiles = await getEventFilePaths();

    await chillout.forEach(eventFiles, async (eventFile) => {
        const start = Date.now();
        let rltPath = path.relative(__dirname, eventFile);
        console.info(`[BİLGİ] "${rltPath}" event yükleniyor..`);

        /** @type {import("./types/Event")} */
        let event = require(eventFile);

        if (!(event?._type == "event")) {
            console.warn(`[UYARI] "${rltPath}" event dosyası boş. Atlanıyor..`);
            return;
        }

        if ("string" != typeof event.id) event.id = path.basename(eventFile).slice(0, -3).replace(/ /g, "");

        if (Underline.events.has(event.id)) {
            console.warn(`[UYARI] "${event.id}" adlı bir event daha önceden zaten yüklenmiş. Atlanıyor.`);
            return;
        }

        if (typeof event.onEvent != "function") {
            console.error(`[HATA] "${rltPath}" olay dosyası geçerli bir onEvent fonksiyonuna sahip değil! Atlanıyor.`);
            return;
        }

        Underline.events.set(event.id, event);
        event.onLoad(client);
        console.info(`[BİLGİ] ("${rltPath}") "${event.id}" adlı event yüklendi. (${Date.now() - start}ms sürdü.)`);
    })

    // Önce ismi daha uzun olanlar test edilsin diye.
    Underline.interactions.sort((a, b) => b.name.length - a.name.length);

    if (Underline.events.size) {
        console.info(`[BİLGİ] ${Underline.events.size} event yüklendi.`);
    } else {
        console.warn(`[UYARI] Hiçbir olay yüklenmedi, herşey yolunda mı?`);
    }

    {
        /** @type {Map<string, (import("./types/Event"))[]>} */
        let eventsMapped;
        eventsMapped = Underline.events.reduce((all, cur) => {
            if (!all.has(cur.eventName)) all.set(cur.eventName, []);
            all.get(cur.eventName).push(cur);
            return all;
        }, new Map());

        await chillout.forEach(
            [...eventsMapped.entries()],
            /**
             * @param {[string, (import('./types/Event'))[]>]} param0
             */
            ([eventName, events]) => {
                console.info(`[BİLGİ] Event "${eventName}" için ${events.length} dinleyici yüklendi!`);

                let listener = (...args) => {

                    setTimeout(async () => {

                        let other = {};

                        let before = await Underline.config.onEvent(eventName, args, other);
                        if (!before) return;
                        args.push(other);
                        chillout.forEach(events, (event) => {
                            if (!event.disabled) {
                                event.onEvent(...args);
                            }
                        });

                    }, 0)
                }
                client.on(eventName, listener);
                eventListeners.push({name: eventName, base: client, listener});
            }
        )
    }

    console.debug(`[HATA AYIKLAMA] Herşey ${Date.now() - loadStart}ms içerisinde yüklendi!`);

    loadStart = 0;
}

async function unloadModule(modulePath) {
    let nodeModule = require.cache[modulePath];
    if (nodeModule) {
        if (nodeModule.children.length) await chillout.forEach(nodeModule.children, async (child) => {
            if (child.filename) unloadModule(child.filename);
        });
    }
    delete require.cache[modulePath];
}

async function unload() {
    console.debug(`[HATA AYIKLAMA] Önbellek temizle işlemi başladı.`);
    let unloadStart = Date.now();

    console.info(`[BILGI] İnteraksiyon listesi temizleniyor..`);
    Underline.interactions.clear();

    console.info(`[BILGI] Olay listesi temizleniyor..`);
    Underline.events.clear();

    console.info(`[BILGI] Olay dinleyicileri temizleniyor..`);
    await chillout.forEach(eventListeners, (el) => {
        el.base.off(el.name, el.listener);
    })

    let pathsToUnload = [...interactionFiles, ...eventFiles];

    await chillout.forEach(pathsToUnload, async (pathToUnload) => {
        console.info(`[BILGI] Modül "${path.relative(__dirname, pathToUnload)}" önbellekten kaldırılıyor!`);
        await unloadModule(pathToUnload);
    });

    console.debug(`[HATA AYIKLAMA] Önbellek temizleme ${Date.now() - unloadStart}ms içerisinde tamamlandı!`);

    unloadStart = 0;
    pathsToUnload = 0;

}

const reload = async () => {
    await unload();
    await load();
};

client.on("interactionCreate", async (interaction) => {
    let subCommandName = "";
    try {
        subCommandName = interaction.options.getSubcommand();
    } catch {
    }

    let subCommandGroupName = "";
    try {
        subCommandGroupName = interaction.options.getSubcommandGroup();
    } catch {
    }


    let uInter = Underline.interactions.find(uInter => {
        switch (uInter.name.length) {
            case 1:
                return !(!(uInter.name[0] === interaction.commandName) && !(uInter.id === interaction.customId && (
                    uInter.actionType === "CHAT_INPUT" && (interaction.isCommand() || interaction.isAutocomplete()) ||
                    uInter.actionType === "SELECT_MENU" && interaction.isSelectMenu() ||
                    uInter.actionType === "BUTTON" && interaction.isButton() ||
                    (uInter.actionType === "USER" || uInter.actionType === "MESSAGE") && interaction.isContextMenu()
                )));
            case 2:
                return uInter.name[0] === interaction.commandName && uInter.name[1] === subCommandName && (interaction.isCommand() || interaction.isAutocomplete());
            case 3:
                return uInter.name[0] === interaction.commandName && !(uInter.name[1] !== subCommandGroupName) && uInter.name[2] === subCommandName && (interaction.isCommand() || interaction.isAutocomplete());
        }
    });

    if (!uInter) return;

    if (interaction.isAutocomplete()) {
        /** @type {Discord.ApplicationCommandOptionChoice} */
        let focussed;
        focussed = null;
        try {
            focussed = interaction.options.getFocused(true)
        } catch {
        }

        let option = uInter.options.find(i => {
            return i.name === focussed?.name && i.autocomplete;
        });
        if (option) {
            let [completeResponse] = await Promise.all([option.onComplete(interaction, focussed.value)]);
            interaction.respond(completeResponse);
        }
        return;
    }

    let other = {};

    let shouldRun1 = config.onInteractionBeforeChecks(uInter, interaction, other);

    if (!shouldRun1) return;

    if (uInter.disabled) {
        config.userErrors.disabled(interaction, uInter, other);
        return;
    }

    if (config.blockedUsers.has(interaction.user.id)) {
        config.userErrors.blocked(interaction, uInter, other);
        return;
    }

    if (uInter.guildOnly && !interaction.guildId) {
        config.userErrors.guildOnly(interaction, uInter, other);
        return;
    }

    if (uInter.calculated.developerOnly && !config.developers.has(interaction.user.id)) {
        config.userErrors.developerOnly(interaction, uInter, other);
        return;
    }

    if (uInter.calculated.guildOwnerOnly && !config.developers.has(interaction.user.id) && interaction.guild.ownerId !== interaction.user.id) {
        config.userErrors.guildOwnerOnly(interaction, uInter, other);
        return;
    }

    if (!(!uInter.guildOnly || uInter.perms.bot.length === 0 || uInter.perms.bot.every(perm => interaction.guild.me.permissions.has(perm)))) {
        config.userErrors.botPermsRequired(interaction, uInter, uInter.perms.bot, other);
        return;
    }

    if (uInter.guildOnly && (!config.developers.has(interaction.user.id)) && uInter.perms.user.length !== 0 && !uInter.perms.user.every(perm => interaction.member.permissions.has(perm))) {
        config.userErrors.userPermsRequired(interaction, uInter, uInter.perms.user, other);
        return;
    }

    if (typeof uInter.coolDown == "number") uInter.coolDown = [{
        type: "user",
        amount: uInter.coolDown,
    }];
    if (typeof uInter.coolDown == "object" && !Array.isArray(uInter.coolDown)) uInter.coolDown = [uInter.coolDown];

    let converter = {
        "user": interaction.user.id,
        "member": interaction.user.id + "_" + interaction.guild?.id,
        "channel": interaction.channelId || interaction.user.id + " _c",
        "guild": interaction.guildId || interaction.user.id + "_g",
        "message": interaction.message?.id || interaction.channelId + "_m" || interaction.user.id + "_m",
        "any": "any"
    }

    let now = Date.now();

    for (let k in converter) {
        let key = converter[k], keyCooldown = uInter.coolDowns.get(key);
        if (now < keyCooldown) {
            config["userErrors"].coolDown(interaction, uInter, keyCooldown - now, k, other);
            return;
        }
    }

    /**
     * @param {number} duration
     * @param {*} type
     */
    let setCoolDown;
    setCoolDown = (duration = 0, type = "user") => {
        let ckey = converter[type] || interaction.user.id;
        if (typeof duration == "number" && duration > 0) {
            return uInter.coolDowns.set(ckey, Date.now() + duration);
        } else {
            return uInter.coolDowns.delete(ckey);
        }
    };

    other.setCoolDown = setCoolDown;
    for (let index = 0; index < uInter.coolDown.length; index++) {

        let cld = uInter.coolDown[index]
        if (cld && !cld.amount) cld.amount = 0;

        if (cld?.amount > 0) {
            setCoolDown(cld?.amount, cld?.type);
        }

    }

    await (async () => {
        let [shouldRun2] = await Promise.all([config.onInteraction(uInter, interaction, other)]);
        if (!shouldRun2) return;
        try {
            await uInter.onInteraction(interaction, other);
        } catch (err) {
            console.error(`[HATA] "${uInter.actionType === "CHAT_INPUT" ? `/${uInter.name.join(" ")}` : `${uInter.name[0]}`}" adlı interaksiyon çalıştırılırken bir hata ile karşılaşıldı!`)
            if (err.message) console.error(`[HATA] ${err.message}`);
            if (err.stack) {
                `${err.stack}`.split("\n").forEach((line) => {
                    console.error(`[HATA] ${line}`);
                });
            }
        }
    })().then(r => r);
});


(async () => {
    await config.onBeforeLoad(client);
    await load();
    await config.onAfterLoad(client);

    await client.login(config.clientToken);

    config.onReady(client);
})();

Underline.reload = reload;
