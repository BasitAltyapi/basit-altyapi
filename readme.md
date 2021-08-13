# Basit Altyapı (Versiyon 1.6.6)

Kullanımı basit ancak bir yandanda içinde birçek özellik barındıran discord bot altyapısı. Sık sık güncelleme alıyor. (Slash Commands)

## Özellikler

- ✅ **Sağtık menü desteği.**
- ✅ **Slash command desteği.**
- ✅ **Slash subcommand desteği.**
- ✅ Async ve aşırı hızlı. `(Komut başına 1ms kadar sürüyor.)`
- ✅ Komut başına _değişken_ yavaşlatma desteği.
- ✅ Komut başına bot gerekli yetki desteği.
- ✅ Komut başına kullanıcı gerekli yetki desteği.
- ✅ Özelleştirilebilir hata mesajları.
- ✅ Mantık hatası uyarı sistemleri.
- ✅ Bottan kullanıcı yasaklama.
- ✅ Komutlarda otomatik tamamlama.
- ✅ Global değişkenlerde otomatik tamamlama. (commands, events, config, client)
- ✅ İç içe klasör desteği.
- ✅ Komut açıp kapama desteği.
- ✅ Sadece geliştiricilerin kullanabildiği komut desteği.
- ✅ Genel event desteği.
- ✅ Event otomatik tamamlama desteği.
- ✅ Event kapatabilme.
- ✅ Gelişmiş config dosyası. Hiç `index.js` dosyasını modifiye etmenize gerek kalmıyor.
- ✅ Komut varsayılanlarını değiştirebilme.
- ✅ Kolay bir şekilde komut öncesi işlem ekleyebilme.
- ✅ Kolay bir şekilde komut veya olay altyapsı oluşturabilme.
- ✅ Kolayca dosya devre dışı bırakılabilme. İsmi tire (-) ile başlayan komutlar ve olaylar umursanmaz.

## Kurlumu

### Gerekenler
- Node.js; `v16.6.1` veya üstü. Ben `v16.6.1` versiyonunda test ettim. Node.js'in kendi sitesinden indirebilirsiniz.
- Yarn; Yarn benim kullandığım paket yöneticisi npm'e göre 8-10 kat daha hızlı ve sorun çözücü. Kurmak için konsolunuza `npm install -g yarn` yazmanız yeterlidir.

### Kurulum
- Proje dosya konumuna gelip `yarn install` yazmanız yeterlidir.
- Proje [kurulumunu yap](#kullanımı)tıktan sonra `node index.js` yazarak projeyi başlatabilirsiniz.

### Kullanımı
- Botun genel ayarlarını, kullanıcı hata mesajlarını düzenlemek ve diğer olaylarda düzenleme yapmak için [`config.js`](./config.js) config dosyasını dikkatlice okuyup ona göre ayarlayabilirsiniz.
- Komutlar için `commands` klasörünün içindeki [`ornekKomut.js`](./commands/-ornekKomut.js) dosyasını dikkatlice okuyabilirsiniz.
- Yeni bir komut dosyası oluşturmak isterseniz `yarn komut` komutunu kullanabilsiniz. Bu sayede sizi ilk komut altyapısını yazma derdinden kurtaracak ve komut hakkında her türlü soruyu soracaktır.

- Slash komutlarını discord üzerinde global olarak yayınlamak için `node loadcommands.js global` veya sadece bir sunucu için yayınlamak istiyorsanız `node loadcommands.js guild <guildId>` komutunu kullanabilirsiniz. Global komutların sunuculara gelmesi 1 saat kadar sürebilir. Aksine suncuya ayit komutlar 5 ile 10 saniye içerisinde gelir. *Not: Botunuzu test ederken global komutlar akisne sunucu komutlarını kullanarak debug etmenizi tavsiye ederim. Çünkü global komutları spam halinde yayınlarsanız ratelimite düşebilirsiniz.*
- Bütün komutları temizlemek için `node loadcommands.js global clear` veya `node loadcommands.js guild <guildId> clear` komutunu kullanabilirsiniz.


- Olaylar için `events` klasörünün içindeki [`ornekOlay.js`](./events/-ornekOlay.js) dosyasını dikkatlice okuyabilirsiniz.
- Yeni bir olay dosyası oluşturmak isterseniz `yarn olay` komutunu kullanabilsiniz. Bu sayede sizi ilk olay altyapısını yazma derdinden kurtaracak ve olay hakkında her türlü soruyu soracaktır.

## Güncelleme

- Güncelleme yaparken yapmanız gereken sadece `types klasörünü`, `other klasörünü`, `index.js dosyası`, `package.json dosyasını` eskisi ile değiştirmek.

## Yardım

- Yardım için discord sunucuma katılıp, benden yardım alabirsiniz: http://armagan.rest/discord
