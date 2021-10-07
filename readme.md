# Basit Altyapı (Versiyon 1.8.3) (v13.x)

Kullanımı basit ancak bir yandanda içinde birçek özellik barındıran discord bot altyapısı. Sık sık güncelleme alıyor. (Slash Commands)
 
## Özellikler

- ✅ **Sağtık menü desteği.**
- ✅ **Slash command desteği.**
- ✅ **Slash subcommand desteği.**
- ✅ **Slash subcommandgroup desteği.**
- ✅ Async ve aşırı hızlı. `(interaksiyon başına 1ms kadar sürüyor.)`
- ✅ interaksiyon başına _değişken_ yavaşlatma desteği.
- ✅ interaksiyon başına bot gerekli yetki desteği.
- ✅ interaksiyon başına kullanıcı gerekli yetki desteği.
- ✅ Özelleştirilebilir hata mesajları.
- ✅ Mantık hatası uyarı sistemleri.
- ✅ Bottan kullanıcı yasaklama.
- ✅ interaksiyonlarda otomatik tamamlama.
- ✅ Global `Underline` objesi. (interactions, events, config, client, Vb.)
- ✅ İç içe klasör desteği.
- ✅ interaksiyon açıp kapama desteği.
- ✅ Sadece geliştiricilerin kullanabildiği interaksiyon desteği.
- ✅ Genel event desteği.
- ✅ Event otomatik tamamlama desteği.
- ✅ Event kapatabilme.
- ✅ Gelişmiş config dosyası. Hiç `index.js` dosyasını modifiye etmenize gerek kalmıyor.
- ✅ interaksiyon varsayılanlarını değiştirebilme.
- ✅ Kolay bir şekilde interaksiyon öncesi işlem ekleyebilme.
- ✅ Kolay bir şekilde interaksiyon veya olay altyapsı oluşturabilme.
- ✅ Kolayca dosya devre dışı bırakılabilme. İsmi tire (-) ile başlayan interaksiyonlar ve olaylar umursanmaz.

## Kurlumu

### İndirme
- Altyapının en son versiyonunu [buradan indirebilirsiniz.](https://github.com/TheArmagan/basit-altyapi/releases/latest)

### Gerekenler
- Node.js; `v16.6.1` veya üstü. Ben `v16.6.1` versiyonunda test ettim. Node.js'in kendi sitesinden indirebilirsiniz.
- Yarn; Yarn benim kullandığım paket yöneticisi npm'e göre 8-10 kat daha hızlı ve sorun çözücü. Kurmak için konsolunuza `npm install -g yarn` yazmanız yeterlidir.

### Kurulum
- Proje dosya konumuna gelip `yarn install` yazmanız yeterlidir.
- Proje [kurulumunu yap](#kullanımı)tıktan sonra `node index.js` yazarak projeyi başlatabilirsiniz.

### Kullanımı
- Botun genel ayarlarını, kullanıcı hata mesajlarını düzenlemek ve diğer olaylarda düzenleme yapmak için [`config.js`](./config.js) config dosyasını dikkatlice okuyup ona göre ayarlayabilirsiniz.
- İnteraksiyonlar için `interactions` klasörünün içindeki [`ornekKomut.js`](./interactions/-ornekKomut.js) ve [`ornekSağtık.js`](./interactions/-ornekSağtık.js) dosyasını dikkatlice okuyabilirsiniz.
- Yeni bir interaksiyon dosyası oluşturmak isterseniz `yarn interaksiyon` interaksiyonunu kullanabilsiniz. Bu sayede sizi ilk interaksiyon altyapısını yazma derdinden kurtaracak ve interaksiyon hakkında her türlü soruyu soracaktır.

- Slash interaksiyonlarını discord üzerinde global olarak yayınlamak için `node publishInteractions.js global` veya sadece bir sunucu için yayınlamak istiyorsanız `node publishInteractions.js guild <guildId>` interaksiyonunu kullanabilirsiniz. Global interaksiyonların sunuculara gelmesi 1 saat kadar sürebilir. Aksine suncuya ayit interaksiyonlar 5 ile 10 saniye içerisinde gelir. *Not: Botunuzu test ederken global interaksiyonlar akisne sunucu interaksiyonlarını kullanarak debug etmenizi tavsiye ederim. Çünkü global interaksiyonları spam halinde yayınlarsanız ratelimite düşebilirsiniz.*
- Bütün interaksiyonları temizlemek için `node publishInteractions.js global clear` veya `node publishInteractions.js guild <guildId> clear` interaksiyonunu kullanabilirsiniz.


- Olaylar için `events` klasörünün içindeki [`-ornekOlay.js`](./events/-ornekOlay.js) dosyasını dikkatlice okuyabilirsiniz.
- Yeni bir olay dosyası oluşturmak isterseniz `yarn olay` interaksiyonunu kullanabilsiniz. Bu sayede sizi ilk olay altyapısını yazma derdinden kurtaracak ve olay hakkında her türlü soruyu soracaktır.

## Güncelleme

- Güncelleme yaparken yapmanız gereken sadece `types klasörünü`, `other klasörünü`, `index.js dosyası`, `package.json dosyasını` eskisi ile değiştirmek.

## Yardım

- Yardım için discord sunucuma katılıp, benden yardım alabirsiniz: https://discord.gg/CFbGS6kXfD
