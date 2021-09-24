// Sağtık menüsünün nerede çıkacağını
// Class tipini değiştirerek değiştirebilirsiniz.
// Örneğin; Underline.UserAction üyeye sağ tıklama ve
// Underline.MessageAction mesaja sağ tıklama interaksiyonudur.
module.exports = new Underline.UserAction({
  // Sağtık menüsünde kullanıcıya gözüken isimdir. Bu isim bir stringdir (yazı)
  name: "Örnek İsim",
  // Örnek komuttaki bütün değerleri buradada kullanabilirsiniz!
})