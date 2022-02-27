module.exports = new Underline.Button({
  name: "ornek",
  id: "ornek",
  description: "...",
  onInteraction(inter, other) {
    let user = other.data[0];
    console.log(user);
    if (!user) return inter.reply(`tıklayanı bulamadım.`);
    inter.reply(`düğme sahibi: ${user.tag} ${user.id}`);
    // Eğer düğmeye tıklayan kişi düğmenin sahibi ise sahip referansı ram'den sil.
    // bu sayede tekrardan tıklayamayacak.
    if (user.id == inter.user.id) user.$unRef();
  },
  perms: {
    bot: ["CREATE_INSTANT_INVITE"],
    user: ["KICK_MEMBERS", "GUILD_OWNER"]
  },
  options: {
    style: "PRIMARY",
    label: "sa"
  }
});