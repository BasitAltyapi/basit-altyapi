>
> # v13.x
> Slash ve Sağtık Menü versiyonu için [dcjs-v13](https://github.com/TheArmagan/basit-altyapi/tree/dcjs-v13) dalına bakabilirsiniz.
>

# Basit Altyapı (Versiyon 1.4.9) (v12.x)

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
- ✅ Global `Underline` objesi. (config, client, commands, events)
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
- Node.js; `v14.17.0` veya üstü. Ben `v14.17.0` versiyonunda test ettim. Node.js'in kendi sitesinden indirebilirsiniz.
- Yarn; Yarn benim kullandığım paket yöneticisi npm'e göre 8-10 kat daha hızlı ve sorun çözücü. Kurmak için konsolunuza `npm install -g yarn` yazmanız yeterlidir.

### Kurulum
- Proje dosya konumuna gelip `yarn install` yazmanız yeterlidir.
- Proje [kurulumunu yap](#kullanımı)tıktan sonra `node index.js` yazarak projeyi başlatabilirsiniz.

### Kullanımı
- Botun genel ayarlarını, kullanıcı hata mesajlarını düzenlemek ve diğer olaylarda düzenleme yapmak için [`config.js`](./config.js) config dosyasını dikkatlice okuyup ona göre ayarlayabilirsiniz.
- Komutlar için `commands` klasörünün içindeki [`ornekKomut.js`](./commands/ornekKomut.js) dosyasını dikkatlice okuyabilirsiniz.
- Yeni bir komut dosyası oluşturmak isterseniz `yarn komut` komutunu kullanabilsiniz. Bu sayede sizi ilk komut altyapısını yazma derdinden kurtaracak ve komut hakkında her türlü soruyu soracaktır.
- Olaylar için `events` klasörünün içindeki [`ornekOlay.js`](./events/ornekOlay.js) dosyasını dikkatlice okuyabilirsiniz.
- Yeni bir olay dosyası oluşturmak isterseniz `yarn olay` komutunu kullanabilsiniz. Bu sayede sizi ilk olay altyapısını yazma derdinden kurtaracak ve olay hakkında her türlü soruyu soracaktır.

## Güncelleme

- Güncelleme yaparken yapmanız gereken sadece `types klasörünü`, `other klasörünü`, `index.js dosyası`, `package.json dosyasını` eskisi ile değiştirmek.

## Yardım

- Yardım için discord sunucuma katılıp, benden yardım alabirsiniz: https://discord.gg/CFbGS6kXfD
