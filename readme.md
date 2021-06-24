# Basit Altyapı

Kullanımı basit ancak bir yandanda içinde birçek özellik barındıran discord bot altyapısı. Sık sık güncelleme alıyor.

## Yapılacaklar

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
- ✅ Event kapatabilme.
- ✅ Gelişmiş config dosyası. Hiç `index.js` dosyasını modifiye etmenize gerek kalmıyor.
- ✅ Komut varsayılanlarını değiştirebilme.

## Kurlumu

### Gerekenler
- Node.js; `v14.17.0` veya üstü. Ben `v14.17.0` versiyonunda test ettim. Node.js'in kendi sitesinden indirebilirsiniz.
- Yarn; Yarn benim kullandığım paket yöneticisi npm'e göre 8-10 kat daha hızlı ve sorun çözücü. Kurmak için konsolunuza `npm install -g yarn` yazmanız yeterlidir.

### Kurulum
- Proje dosya konumuna gelip `yarn install` yazmanız yeterlidir.
- Proje [kurulumunu yap](#kullanımı)tıktan sonra `node index.js` yazarak projeyi başlatabilirsiniz.

### Kullanımı
- Botun genel ayarlarını, kullanıcı hata mesajlarını düzenlemek ve diğer olaylarda düzenleme yapmak için [`config.js`](./config.js) config dosyasını dikkatlice okuyup ona göre ayarlayabilirsiniz.
- Komutlar için `commands` klasörünün içindeki [`ornekKomut.js`](./commands/ornekKomut.js) dosyasını dikkatlice okuyabilirsiniz.
- Olaylar için `events` klasörünün içindeki [`ornekOlay.js`](./events/ornekOlay.js) dosyasını dikkatlice okuyabilirsiniz.

## Güncelleme

- Güncelleme yaparken yapmanız gereken sadece `types klasörünü`, `index.js dosyası`, `package.json dosyasını` eskisi ile değiştirmek.
