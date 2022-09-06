# ⚠️ BU ALTYAPI ARTIK GELİŞTİRİLMİYOR - VE YARDIMCI OLMUYORUM YENİ ALT YAPIYI İZLEMEDE KALIN [MostFeatured/DiscordBotInfrastructure](https://github.com/MostFeatured/DiscordBotInfrastructure)

---


# Basit Altyapı (Versiyon 3.0) (v14.x) #

Profesyoneller tarafından geliştirilen ve "*Yeryüzünde her zaman ücretsiz ve değerli bir şeyler olacaktır.*" felsefesiyle hazırlanan açık kaynaklı, güncel, stabil ve gelişmiş Discord bot altyapısı. 
 
# Özellikler #

- ✅ Plugin sistemi. (Altyapıya istediğiniz özellikleri parça parça ekleyin!)
- ✅ Pluginler için TAM tip desteği.
- ✅ Çoklu dil desteği.
- ✅ Sunucuya özel komut paylaşma tipleri.
- ✅ SelectMenu ve Button desteği.
- ✅ SelectMenu ve Button tam component ve options desteği.
- ✅ Autocomplate (otomatik tamamlama) desteği.
- ✅ Sağtık menü desteği.
- ✅ Slash command desteği.
- ✅ Slash subcommand desteği.
- ✅ Slash subcommandgroup desteği.
- ✅ Async ve aşırı hızlı. (interaksiyon başına 1ms kadar sürüyor!)
- ✅ interaksiyon başına değişken yavaşlatma desteği.
- ✅ interaksiyon başına bot gerekli yetki desteği.
- ✅ interaksiyon başına kullanıcı gerekli yetki desteği.
- ✅ Özelleştirilebilir hata mesajları.
- ✅ Mantık hatası uyarı sistemleri.
- ✅ Bottan kullanıcı yasaklama.
- ✅ interaksiyonlarda otomatik tamamlama.
- ✅ Global Underline objesi. (interactions, events, config, client vb.)
- ✅ İç içe klasör desteği.
- ✅ interaksiyon açıp kapama desteği.
- ✅ Sadece geliştiricilerin kullanabildiği interaksiyon desteği.
- ✅ Genel event desteği.
- ✅ Event otomatik tamamlama desteği.
- ✅ Event kapatabilme.
- ✅ Gelişmiş config dosyası. (Artık index.js dosyasını modifiye etmenize gerek yok!)
- ✅ interaksiyon varsayılanlarını değiştirebilme.
- ✅ Kolay bir şekilde interaksiyon öncesi işlem ekleyebilme.
- ✅ Kolay bir şekilde interaksiyon veya olay altyapsı oluşturabilme.
- ✅ Kolayca dosya devre dışı bırakılabilme. (İsmi tire (-) ile başlayan interaksiyonlar ve olaylar umursanmaz.)
- ✅ Düğme ve Seç menülerde değer/referans taşıyabilme.
- ✅ Other objesi ile her işlemden önce değer belirtebilme.
- ✅ Full otomatik dil desteği. (Komutu kullanan kişinin dilini otomatik belirleme.)
- ✅ Redis ve clustering kullanarak 100% sharding desteği. Normal bir altyapıya kıyasla %80 daha az ram kullanımı!
- ✅ Modal desteği.
- ✅ Geliştrici modu desteği. (Bütün tip dosyaları otomatik olarak güncellenecektir.)

# Kurulum Şeması #

# İndirme #
- Altyapının en son versiyonunu [buradan indirebilirsiniz.](https://github.com/TheArmagan/basit-altyapi/releases/latest)

# Gerekenler #
- Node.js; `v18.x`.
- Yarn; `npm install -g yarn`. (Yarn, bizlerin kullandığı ve npm'e göre daha hızlı ve stabil olan bir paket yöneticisidir.)

# Kurulum #
- Proje dosya konumuna gelinip `yarn install` yazılması gerekmektedir ve yeterlidir.
- Proje [kurulumunu yap](#kullanım)tıktan sonra `yarn start` yazarak projeyi başlatabilirsiniz.

# Kullanım #
- Botun genel ayarlarını, kullanıcı hata mesajlarını ve diğer olaylarda düzenleme yapmak için [`config.js`](./config.js) config dosyasını kullanabilirsiniz.
- İnteraksiyonlar için `interactions` klasörünün içindeki [`ornekKomut.js`](./interactions/-ornekKomut.js) ve [`ornekSağtık.js`](./interactions/-ornekSağtık.js) dosyasını kullanabilirsiniz.
- Yeni bir interaksiyon dosyası oluşturmak isterseniz `yarn interaksiyon` interaksiyonunu kullanabilsiniz. Bu sayede sizi ilk interaksiyon altyapısını yazma derdinden kurtaracak ve interaksiyon hakkında her türlü soruyu soracaktır.
- Slash interaksiyonlarını Discord üzerinde global olarak yayınlamak için `node publishInteractions.js global` interaksiyonunu kullanabilirsiniz.
- Slash interaksiyonlarını sadece bir sunucu için yayınlamak istiyorsanız `node publishInteractions.js guild <guildId>` interaksiyonunu kullanabilirsiniz. 
- Bütün interaksiyonları temizlemek için `node publishInteractions.js global clear` veya `node publishInteractions.js guild <guildId> clear` interaksiyonunu kullanabilirsiniz.
  
  Bölüm Bilgilendirmesi: Global interaksiyonların sunuculara gönderilmesi yaklaşık 1 saat kadar sürebilmektedir. Sunucuya özel interaksiyonlar ise 5-10 saniye içerisinde aktif olmaktadır. 
  *Not: Botunuzu test ederken global interaksiyonlar yerine sunucu interaksiyonlarını kullanarak debug etmenizi tavsiye ederiz. Global interaksiyonları spam halinde yayınlarsanız ratelimite takılabilirsiniz.*

- Olaylar için `events` klasörünün içindeki [`-ornekOlay.js`](./events/-ornekOlay.js) dosyasını kullanabilirsiniz.
- Yeni bir olay dosyası oluşturmak isterseniz `yarn olay` interaksiyonunu kullanabilsiniz. Bu sayede sizi ilk olay altyapısını yazma derdinden kurtaracak ve olay hakkında her türlü soruyu soracaktır.

# Yardım #
- Bu rehber üzerindeki bilgiler size yetersiz geldiyse ve geliştiricilerden destek almak isterseniz aşağıdaki hesaplar üzerinden ilgili kişilere erişebilirsiniz.

- Geliştiriciler: `Armagan#4869` & `Erdm#8310`
- Düzenleme ve Destek: `Maschera#6666`

---

# Basit Altyapı (Basic infrastructure) (Version 3.0) (v14.x)

Developed by professionals with the philosophy "*There will always be something free and valuable in the world.*" open source, up-to-date, stable and advanced Discord bot infrastructure. 
 
# Features

- ✅ Plugin system. (Add features to the infrastructure piece by piece!)
- ✅ FULL type support for plugins.
- ✅ Multiple language support.
- ✅ Server specific command sharing types.
- ✅ SelectMenu and Button support.
- ✅ SelectMenu and Button full component and options support.
- ✅ Autocomplate (autocomplete) support.
- ✅ Right menu support.
- ✅ Slash command support.
- ✅ Slash subcommand support.
- ✅ Slash subcommandgroup support.
- ✅ Async and extremely fast (takes up to 1ms per interaction!)
- ✅ Support for variable slowdown per interaction.
- ✅ Bot required authorization support per interaction.
- ✅ User required authorization support per interaction.
- ✅ Customizable error messages.
- ✅ Logic error warning systems.
- ✅ User banning from bot.
- ✅ Autocompletion in interactions.
- ✅ Global Underline object (interactions, events, config, client etc.)
- ✅ Nested folder support.
- ✅ Support for opening and closing interactions.
- ✅ Interaction support only available to developers.
- ✅ General event support.
- ✅ Event auto-completion support.
- ✅ Event closure.
- ✅ Advanced config file. (No need to modify index.js anymore!)
- ✅ Ability to change interaction defaults.
- ✅ Ability to add pre-interaction actions in an easy way.
- ✅ Easily create an interaction or event substructure.
- ✅ Easily disable files (interactions and events with a hyphen (-) are ignored).
- ✅ Ability to move value/reference in Button and Select menus.
- ✅ Ability to specify value before each operation with Other object.
- ✅ Fully automatic language support (automatic determination of the language of the person using the command).
- ✅ 100% sharding support using Redis and Clustering. 80% less ram usage compared to a normal infrastructure!
- ✅ Modal support.
- ✅ Developer mode support. (All type files will be updated automatically.)

# Installation Diagram

# Download
- The latest version of the infrastructure [download here](https://github.com/TheArmagan/basit-altyapi/releases/latest).

# What's needed
- Node.js; `v18.x`.
- Yarn; `npm install -g yarn`. (Yarn is a package manager that we use and is faster and more stable than npm).

# Installation
- Navigate to the project file location and type `yarn install` and that's enough.
- After clicking on the project [install](#usage) you can start the project by typing `yarn start`.

# Use
- You can use the config file [`config.js`](./config.js) to edit the general settings of the bot, user error messages and other events.
- For interactions, you can use the [`ornekKomut.js`](./interactions/-ornekKomut.js) and [`ornekSağtık.js`](./interactions/-ornekSağtık.js) files in the `interactions` folder.
- If you want to create a new interaction file, you can use the `yarn interaction` interaction. This will save you the hassle of writing the initial interaction engine and will ask you all kinds of questions about the interaction.
- To publish Slash interactions globally on Discord, you can use the `node publishInteractions.js global` interaction.
- If you want to publish Slash interactions for only one server, you can use the `node publishInteractions.js guild <guildId>` interaction. 
- To clear all interactions, you can use the `node publishInteractions.js global clear` or `node publishInteractions.js guild <guildId> clear` interaction.
  
  Section Information: Global interactions can take about 1 hour to be sent to the servers. Server specific interactions are active within 5-10 seconds. 
  *Note: When testing your bot, we recommend debugging using server interactions instead of global interactions. If you spam global interactions, you may get stuck in ratelimit.

- For events you can use the file [`-ornekOlay.js`](./events/-ornekOlay.js) inside the `events` folder.
- If you want to create a new event file, you can use the `yarn event` interaction. This will save you the trouble of writing the initial event engine and will ask you all kinds of questions about the event.

# Help
- If you find the information in this guide insufficient and would like to get support from the developers, you can reach them through the accounts below.

- Developers: `Armagan#4869` & `Erdm#8310`
- Editing and Support: `Maschera#6666`
