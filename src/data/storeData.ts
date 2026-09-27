import { StoreConfig, Banner, Category, Product, GroupChannel, Testimonial, FAQItem } from '../types.ts';

export const STORE_CONFIG: StoreConfig = {
  "brandName": "Pionz Store",
  "logo": "https://cdn.phototourl.com/free/2026-08-14-3ae483b8-50e8-4aa2-891e-04031dfc30a6.jpg",
  "banner": "https://i.ibb.co/HDWzWTYL/Screenshot-2026-09-27-10-56-03-982-com-openai-chatgpt-edit.jpg?v=20260927",
  "tagline": "Marketplace Jual Beli Akun Game Aman & Terpercaya",
  "description": "Pionz Store adalah marketplace jual beli akun game Free Fire dengan proses cepat, transaksi aman, transparan, dan garansi akun dengan bantuan admin.",
  "waNumber": "6285643698411",
  "customerServiceNumber": "6285643698411",
  "operatingHours": "Open 09.00 - 23.00 WIB",
  "maintenanceMode": false,
  "maintenanceMessage": "Toko sedang dalam pemeliharaan sistem. Kami akan segera kembali! Untuk transaksi darurat silakan hubungi WhatsApp Admin.",
};

export const BANNERS: Banner[] = [
  {
    "id": "banner-pionz-main",
    "image": "https://i.ibb.co/HDWzWTYL/Screenshot-2026-09-27-10-56-03-982-com-openai-chatgpt-edit.jpg?v=20260927",
    "title": "Pionz Store - Official Game Marketplace",
    "subtitle": "Akun Free Fire Sultan, Pelajar & Limited dengan Transaksi Aman & Garansi Akun"
  }
];

export const CATEGORIES: Category[] = [
  {
    "id": "all",
    "label": "Semua Akun FF",
    "icon": "flame",
    "image": "https://api.heyyami.web.id/api/media/88dca1a7cb6c5e1baff93d52c29efbb3bbf1a1a23a69f0c7.webp"
  },
  {
    "id": "category-free-fire",
    "label": "Free Fire",
    "icon": "flame",
    "image": "https://api.heyyami.web.id/api/media/88dca1a7cb6c5e1baff93d52c29efbb3bbf1a1a23a69f0c7.webp"
  }
];

export const PRODUCTS: Product[] = [
  {
    "id": "produk-798b427e-27f2-497d-9ce3-aacd50c64221",
    "name": "Jenggot bnl gagah ini Max 1 ft sg2 rapper",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/253915194e1fc58877199f62da67be45434fd16384fddc40.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/253915194e1fc58877199f62da67be45434fd16384fddc40.webp"
    ],
    "price": 550000,
    "discountPrice": 500000,
    "rating": 5,
    "badge": "HOT",
    "specs": [
      "Jenggot bnl gagah ini",
      "Max 1 ft sg2 rapper",
      "Vault 584, bundle legendary ada 2, bundle saitama, kemeja putih, celana angel merah/ungu on, cn masih ada 2, spek lain nya cek pict aja.",
      "Op? 500k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": true,
    "soldPrice": 500000,
    "soldAt": 1790141292000
  },
  {
    "id": "produk-e3712449-aedd-46e6-976b-85b4f2eaee13",
    "name": "Otw max 2 ft sg2 4 rasa Sg2 evo, rapper, lumut, abu Animasi medkit on",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/046d21a2a42483ab7f562e95d4df9b0d167059d25181ab34.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/046d21a2a42483ab7f562e95d4df9b0d167059d25181ab34.webp"
    ],
    "price": 400000,
    "discountPrice": null,
    "rating": 5,
    "badge": "PELAJAR",
    "specs": [
      "Otw max 2 ft sg2 4 rasa",
      "Sg2 evo, rapper, lumut, abu",
      "Animasi medkit on",
      "Vault 348, bundle inosuke, bundle nezuko, poker kuning on, celana angel 2 warna, animasi kedatangan ada 4, ganti nama on, spek lain cek foto aja.",
      "Op? 400k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": true,
    "soldPrice": 400000,
    "soldAt": 1790269920000
  },
  {
    "id": "produk-11d67057-4051-43c6-8a70-d30dd7d3b9e4",
    "name": "SOLD DI DP (TIKUNG LANGSUNG CHAT ADMIN)",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/252a524c4c6329bbb00cc2decb0cc7cb04ed2d979d8165a0.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/252a524c4c6329bbb00cc2decb0cc7cb04ed2d979d8165a0.webp"
    ],
    "price": 800000,
    "discountPrice": null,
    "rating": 5,
    "badge": "SULTAN",
    "specs": [
      "Gagah nih pak",
      "Animasi medkit ada 2",
      "Max otw 3 ft sg2 rapper+evo",
      "Epas lumayan rapih",
      "Vault 629, fjoker v2 on, bundle opm lengkap, poker kuning, clubber ada 2, animasi kedatangan ada 4, spek lain cek foto ajah.",
      "Op? 800k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": true,
    "sold": false,
    "soldPrice": null,
    "soldAt": null
  },
  {
    "id": "produk-c34f5abb-c86f-4ca0-a620-fb525514958f",
    "name": "Epas 8/10 on Scar max ft sg2 rapper",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/b8ccc3b83ac353c4d1ae5cd0fd0ae2075b56dbfc46ce6f83.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/b8ccc3b83ac353c4d1ae5cd0fd0ae2075b56dbfc46ce6f83.webp"
    ],
    "price": 350000,
    "discountPrice": null,
    "rating": 5,
    "badge": "PELAJAR",
    "specs": [
      "Epas 8/10 on",
      "Scar max ft sg2 rapper",
      "Vault 483, kemeja merah on, celana angel putih, skywing kurama on, spek lain nya cek foto saja.",
      "Op? 350k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": true,
    "soldPrice": 300000,
    "soldAt": 1789807630000
  },
  {
    "id": "produk-54b30c4d-80aa-4524-a8e6-07f923fd85c6",
    "name": "Evo 2 otw max 1 Sg2 evo lvl 5, lumut, gurun",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/bf76688aa915aebe7300f4099ec27f593b10610829c706db.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/bf76688aa915aebe7300f4099ec27f593b10610829c706db.webp"
    ],
    "price": 200000,
    "discountPrice": null,
    "rating": 5,
    "badge": "PELAJAR",
    "specs": [
      "Evo 2 otw max 1",
      "Sg2 evo lvl 5, lumut, gurun",
      "Vault 196, bundle void on, celana angel ungu, animasi kedatangan on, spek lain cek foto aja.",
      "Op? 200k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": true,
    "soldPrice": 200000,
    "soldAt": 1790020770000
  },
  {
    "id": "produk-43fd8bb0-14c4-43e9-9e2b-f006f2e554ea",
    "name": "SOLD DI DP (TIKUNG LANGSUNG CHAT ADMIN)",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/0e0eaf5696252f022dd92660816216d09edea415b22413f1.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/0e0eaf5696252f022dd92660816216d09edea415b22413f1.webp"
    ],
    "price": 750000,
    "discountPrice": null,
    "rating": 5,
    "badge": "SULTAN",
    "specs": [
      "Poker biru + merah",
      "Max 1 otw 2",
      "Sg2 opm + omped",
      "Vault 660, bundle gagah-gagah ini mah, animasi medkit on, spek lainnya cek foto aja.",
      "Op? 750k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": true,
    "sold": false,
    "soldPrice": null,
    "soldAt": null
  },
  {
    "id": "produk-8832e7ee-2952-49c2-bca1-fbcb7d02f64e",
    "name": "SOLD DI DP (TIKUNG LANGSUNG CHAT ADMIN)",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/b535e0ff52e3651294b8fe2b29bd0d089a0b7723e97cd0ef.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/b535e0ff52e3651294b8fe2b29bd0d089a0b7723e97cd0ef.webp"
    ],
    "price": 800000,
    "discountPrice": null,
    "rating": 5,
    "badge": "SULTAN",
    "specs": [
      "PRIME 6 GAGAH",
      "Evo 4 max 3",
      "Sg2 evo + omped",
      "Vault jibun 828, fjoker v2 on, bundle rey masterio on, bundle naruto ada 3, bundle bencong, genji on, celana angel biru, topi jerami, spek lain nya cek foto aja.",
      "Op? 800k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": true,
    "sold": false,
    "soldPrice": null,
    "soldAt": null
  },
  {
    "id": "produk-23be0cbe-6c0b-48ed-ba83-0f80c0a97654",
    "name": "Ak47 lvl 5 ft sg2 opm",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/bb2aaeb5b3daeed353131472e47e0bcfe1426f7d61988c46.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/bb2aaeb5b3daeed353131472e47e0bcfe1426f7d61988c46.webp"
    ],
    "price": 450000,
    "discountPrice": null,
    "rating": 5,
    "badge": "HOT",
    "specs": [
      "Ak47 lvl 5 ft sg2 opm",
      "Vault 447, poker kuning on, bundle naruto ada 2, bundle genos on, animasi kedatangan on, tinju opm, spek lainnya cek foto aja.",
      "Op? 450k?",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": true,
    "soldPrice": 420000,
    "soldAt": 1789902662000
  },
  {
    "id": "produk-8ce9ccb3-0ff9-45ae-93c8-711963d54c3d",
    "name": "Evo 5 max 3 Sg2 opm, rapper, lumut, omped",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/98e70377f3a2b2ee30f99e0815584b9dd0147483b8bcea60.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/98e70377f3a2b2ee30f99e0815584b9dd0147483b8bcea60.webp"
    ],
    "price": 850000,
    "discountPrice": null,
    "rating": 5,
    "badge": "SULTAN",
    "specs": [
      "Banyak di cari nih",
      "Evo 5 max 3",
      "Sg2 opm, rapper, lumut, omped",
      "Vault 594, bundle demon slayer ada 3, bundle genos on, sweater putih, celana angel merah, sepatu jordan, animasi kedatangan ada 4, animasi end musuh ada 3, spek lainnya cek foto aja.",
      "Op? 850k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": true,
    "soldPrice": 800000,
    "soldAt": 1789648619000
  },
  {
    "id": "produk-9daab06e-c642-4ba4-b011-e9d8ac7e0c2c",
    "name": "Max 2 ft sg2 pisang",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/b1fb6bc0007c4289c712933b6fc015881f1055328064cd17.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/b1fb6bc0007c4289c712933b6fc015881f1055328064cd17.webp"
    ],
    "price": 250000,
    "discountPrice": 230000,
    "rating": 5,
    "badge": "PELAJAR",
    "specs": [
      "Max 2 ft sg2 pisang",
      "Vault 492, bundle naruto ada 5, emote super on, sepatu jordan on, skin skywing ada 6, spek lainnya cek di foto aja.",
      "Op? 250k.",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": true,
    "soldPrice": 230000,
    "soldAt": 1789953077000
  },
  {
    "id": "produk-cfefe815-70a0-4d1c-b018-6435716debc6",
    "name": "Otw max 1 ft sg2 lumut",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/71d3ca79d2af2f15fe579c1852cbdc361c5b3b44e9997a99.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/71d3ca79d2af2f15fe579c1852cbdc361c5b3b44e9997a99.webp"
    ],
    "price": 170000,
    "discountPrice": null,
    "rating": 5,
    "badge": "PELAJAR",
    "specs": [
      "PRIME ASLI 4 Otw max 1 ft sg2 lumut",
      "Vault 190, bundle gagah-gagah ini mah, celana angel ungu on, animasi kedatangan ada 3, animasi perubahan on, spek lainnya cek foto aja.",
      "Op? 170k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": true,
    "soldPrice": 170000,
    "soldAt": 1790390119000
  },
  {
    "id": "produk-f30cd683-119f-4d0d-b9d6-9951c146a653",
    "name": "Epas s8 ft sg2 evo lvl 6",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/c2d8145c65b4088201dd522e6a8f45816739a8b8d3098c75.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/c2d8145c65b4088201dd522e6a8f45816739a8b8d3098c75.webp"
    ],
    "price": 250000,
    "discountPrice": 230000,
    "rating": 5,
    "badge": "LIMITED",
    "specs": [
      "Epas s8 ft sg2 evo lvl 6",
      "Spek nya cek foto aja ya.",
      "Op? 250k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": true,
    "soldPrice": 230000,
    "soldAt": 1789927870000
  },
  {
    "id": "produk-4b8fbdbb-01a1-4762-b7d7-a93391a9486d",
    "name": "Max 2 otw 4 ft sg2 rapper Anim medkit on",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/b68bd1bd1794f4ad4b2b7a719928d9876b3fbc964492dcde.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/b68bd1bd1794f4ad4b2b7a719928d9876b3fbc964492dcde.webp"
    ],
    "price": 450000,
    "discountPrice": null,
    "rating": 5,
    "badge": "HOT",
    "specs": [
      "Max 2 otw 4 ft sg2 rapper Anim medkit on",
      "Vault 316, bundle bluelock, bundle void, celana angel 2 warna, sepatu jordan on, cn masih ada 2x, MB Masih 22h lagi, spek lainnya cek foto aja.",
      "Op? 450k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": false,
    "soldPrice": null,
    "soldAt": null
  },
  {
    "id": "produk-0955a677-d729-488a-9e94-29165bf793a7",
    "name": "Otw max 1 ft sg2 omped",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/8577fcd4e6d26c5a4c853d4f1d81b897532c91c0d467700b.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/8577fcd4e6d26c5a4c853d4f1d81b897532c91c0d467700b.webp"
    ],
    "price": 150000,
    "discountPrice": null,
    "rating": 5,
    "badge": "PELAJAR",
    "specs": [
      "Otw max 1 ft sg2 omped",
      "Spek langsung cek pict aja yaa.",
      "Op? 150k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": true,
    "soldPrice": 150000,
    "soldAt": 1790327701000
  },
  {
    "id": "produk-e4d34890-01b2-433a-ae92-d0d36122f6a5",
    "name": "Receh gagah ni sg2 otw max",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/ce780d40f6dcf6a9ebd4cbd41670f3a418ee503219822442.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/ce780d40f6dcf6a9ebd4cbd41670f3a418ee503219822442.webp"
    ],
    "price": 150000,
    "discountPrice": null,
    "rating": 5,
    "badge": "PELAJAR",
    "specs": [
      "Receh gagah ni sg2 otw max",
      "Vault 103, bundle sukuna on, bundle naruto ada 5, cluber on, celana angel 2 warna, cn masih ada 2, spek lain cek pict aja.",
      "Op? 150k ajaa",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": true,
    "soldPrice": 150000,
    "soldAt": 1789263499000
  },
  {
    "id": "produk-281fd101-4284-46a5-95ad-2f50c5eade2a",
    "name": "SOLD DI DP (TIKUNG LANGSUNG CHAT ADMIN)",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/78abeb8760ce568827d23390daef43173449d9fc40abb2fb.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/78abeb8760ce568827d23390daef43173449d9fc40abb2fb.webp"
    ],
    "price": 800000,
    "discountPrice": null,
    "rating": 5,
    "badge": "LIMITED",
    "specs": [
      "Double max ft sg2 rapper + lumut",
      "Vault 635, bundle gintama on, bundle genji, poker ijoo, topi jerami, celana angel merah, gelana gajah/kotak on, spek lainnya cek pict ajaa.",
      "Op? 800k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": true,
    "sold": false,
    "soldPrice": null,
    "soldAt": null
  },
  {
    "id": "produk-e2aa23d1-1c24-4028-83ec-e7cc4474ffb1",
    "name": "PRIME 7 Evo 8 max 2 otw 3",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/30c37843ddcf703bd3c2d1ecf5378616a60822d5d916234b.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/30c37843ddcf703bd3c2d1ecf5378616a60822d5d916234b.webp"
    ],
    "price": 800000,
    "discountPrice": null,
    "rating": 5,
    "badge": "SULTAN",
    "specs": [
      "PRIME 7",
      "Evo 8 max 2 otw 3",
      "Sg2 4 rasa",
      "Pletok digimon on",
      "Vault 508, bundle legendary ada 3, bundle anime rame, bundle genji on, clubber ada 2, celana angel 3 warna, sepatu jordan on, anim kedatangan ada 6, anim perubahan ada 4, anim medkit on, emote super ada 2, spek lain cek pict aja yaa.",
      "Op? 800k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": true,
    "soldPrice": 750000,
    "soldAt": 1789699092000
  },
  {
    "id": "produk-af34d690-3bf7-4889-b1c9-5d16ddb59d53",
    "name": "Ragnarok gagah nih PRIME 6",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/f27f79252829f938f615f898d5a5c43ec973c0034a6913bc.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/f27f79252829f938f615f898d5a5c43ec973c0034a6913bc.webp"
    ],
    "price": 550000,
    "discountPrice": null,
    "rating": 5,
    "badge": "HOT",
    "specs": [
      "PRIME 6",
      "Vault 599, baju-baju gagah nih, fjoker v2 on, bundle bluelock 3, bundle naruto 5, poker kuning on, clubber pink, celana angel, spek lainnya cek pict aja.",
      "Op? 550k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": true,
    "soldPrice": 550000,
    "soldAt": 1790354642000
  },
  {
    "id": "produk-a0351b0c-3371-4f21-a47e-f2bfbfe7d1f1",
    "name": "Epas S1/3/7/8/9/10 I Max 3 otw 4 ft sg2 lumut & matel",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/e261c606058c23489d3a911d313d2a8fe0890353a6ca532b.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/e261c606058c23489d3a911d313d2a8fe0890353a6ca532b.webp"
    ],
    "price": 2500000,
    "discountPrice": null,
    "rating": 5,
    "badge": "LIMITED",
    "specs": [
      "Bismillah sold lagi!!!",
      "PRIME 7",
      "Max 3 otw 4 ft sg2 lumut & matel",
      "Epas S1/3/7/8/9/10 on",
      "Vault 716, fjoker v2, kemeja merah on, sweater hitam, celana penjaruy, celana angel biru, celana gajah, sepatu jordan, spek lainnya cek pict aja.",
      "Op? 2.5",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": true,
    "sold": false,
    "soldPrice": null,
    "soldAt": null
  },
  {
    "id": "produk-ffbef27d-6bb9-42ca-b4ff-9d6864b4beb9",
    "name": "SOLD DI DP (TIKUNG LANGSUNG CHAT ADMIN)",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/50a773dcdc78b425f8de2be761b2db4567fc8e0c4fe42c3b.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/50a773dcdc78b425f8de2be761b2db4567fc8e0c4fe42c3b.webp"
    ],
    "price": 550000,
    "discountPrice": null,
    "rating": 5,
    "badge": "HOT",
    "specs": [
      "Otw max 3 ft sg2 omped",
      "Vault 507, bundle opm ada 3, bundle genji on, celana angel biru, sepatu jordan, lain nya cek pict ajaa.",
      "Op? 550k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": false,
    "soldPrice": null,
    "soldAt": null
  },
  {
    "id": "produk-54411950-7076-494b-b6a3-d5ab512a4d79",
    "name": "Jenggot Bnl Dana Pelajar",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/9cc57d23028261bb11b9675e4f4bf5699d76a6328680a133.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/9cc57d23028261bb11b9675e4f4bf5699d76a6328680a133.webp"
    ],
    "price": 300000,
    "discountPrice": null,
    "rating": 5,
    "badge": "PELAJAR",
    "specs": [
      "Evo ada 3 ft sg2 2 rasa",
      "Vault 369, bundle bencong on, bundle void, celana kotak, lainnya cek pict aja.",
      "Op? 300k",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": false,
    "sold": false,
    "soldPrice": null,
    "soldAt": null
  },
  {
    "id": "produk-2fe1e6b8-e767-4c4f-8aa0-5b074b29406d",
    "name": "S1 x Gojo I Max 2",
    "game": "Free Fire",
    "image": "https://api.heyyami.web.id/api/media/ba0840f727db5a67af3c445895726854c018cb16c2c40b8c.webp",
    "images": [
      "https://api.heyyami.web.id/api/media/ba0840f727db5a67af3c445895726854c018cb16c2c40b8c.webp"
    ],
    "price": 1300000,
    "discountPrice": null,
    "rating": 5,
    "badge": "LIMITED",
    "specs": [
      "Nih s1 pak bozz",
      "Max 2",
      "Bundle gojo on, clubber ada 3, sweater hitam on, animasi kedatangan ada 5, anim medkit on, Diamond masih 2955, Mb masih 41h, spek lainnya cek pict aja.",
      "Op? 1.3",
      "Rebind only + garansi 15h/sampe kebind ke email mu."
    ],
    "flash": true,
    "sold": false,
    "soldPrice": null,
    "soldAt": null
  },
  {
    "id": "produk-mlbb-01",
    "name": "Akun MLBB Sultan 12 Collector + 3 Legend + Prime",
    "game": "Mobile Legends",
    "image": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80"
    ],
    "price": 1250000,
    "discountPrice": 1100000,
    "rating": 5,
    "badge": "SULTAN",
    "specs": [
      "Rank Mythical Glory bintang 80+",
      "Skin Collector 12 (Gusion, Granger, Yu Zhong, dll)",
      "Legend 3 Skin (Miya, Gusion, Alucard)",
      "Emblem IX Max semua",
      "All unbind siap bind email pribadi pembeli + garansi 15 hari."
    ],
    "flash": true,
    "sold": false,
    "soldPrice": null,
    "soldAt": null
  },
  {
    "id": "produk-mlbb-02",
    "name": "Akun MLBB Pelajar Skin KOF Chou + Lightborn Granger",
    "game": "Mobile Legends",
    "image": "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80"
    ],
    "price": 250000,
    "discountPrice": 220000,
    "rating": 5,
    "badge": "PELAJAR",
    "specs": [
      "Skin KOF Iori Yagami Chou on",
      "Lightborn Granger",
      "Epic Shop rame, winrate 65%+",
      "All unbind aman garansi admin Pionz Store."
    ],
    "flash": false,
    "sold": false,
    "soldPrice": null,
    "soldAt": null
  }
];

export const GROUPS: GroupChannel[] = [
  {
    "id": "grup-d5133b2b-e583-4be5-b32f-52747742888d",
    "name": "Whatsapp Utama",
    "image": "https://api.heyyami.web.id/api/media/b6bbc1f180926812a05ba80532795f23c86f38e93ae1db50.webp",
    "url": "https://wa.me/6285643698411"
  },
  {
    "id": "grup-94b41441-6e0e-4bcc-bb73-e69f3eb92cd7",
    "name": "Whatsapp Japost",
    "image": "https://api.heyyami.web.id/api/media/1db5e98158e4c09dbb27f768812949c6042ecbd16d190003.webp",
    "url": "https://wa.me/6289525072166"
  },
  {
    "id": "grup-612b0277-d212-4bc0-a8b1-2d36dd5baed2",
    "name": "Whatsapp Rekber",
    "image": "https://api.heyyami.web.id/api/media/fe5a86946131bf0c98639c9dc708a81ccb2daa61977f2f1c.webp",
    "url": "https://wa.me/628812859069"
  },
  {
    "id": "grup-1c6d0664-7319-414c-afbd-37b935539fbe",
    "name": "Whatsapp Cadangan",
    "image": "https://api.heyyami.web.id/api/media/31a2bbaa9a733223ff92d9c9c78a6e897673f4b035703a6e.webp",
    "url": "https://wa.me/6289663040006"
  },
  {
    "id": "grup-ebb2fdc2-3899-4845-9ab8-e42d2e2a19d3",
    "name": "Saluran Pionz Market (Khusus Stok)",
    "image": "https://api.heyyami.web.id/api/media/f399d42e0235a3a75bc288af4078c7cd16a9544d557a05e0.webp",
    "url": "https://whatsapp.com/channel/0029VbCwZ5SLdQekP1rqu004"
  },
  {
    "id": "grup-46ef970b-5aa2-479a-b98e-8c5095474513",
    "name": "Saluran Pionz Japost (GRATIS)",
    "image": "https://api.heyyami.web.id/api/media/a1aba3e88f99ab15cc59f11f404545d5083a161e06f53c05.webp",
    "url": "https://whatsapp.com/channel/0029VbCwTfI17Emm7lDUOX1A"
  },
  {
    "id": "grup-1711d465-38e1-4822-9553-5e8066047c60",
    "name": "Saluran Pionz Update",
    "image": "https://api.heyyami.web.id/api/media/3ac22d31b2f406e357c30b81dfe4dab27a4c8d1d00a3121b.webp",
    "url": "https://whatsapp.com/channel/0029VbDAsNF9cDDWcPPLFj08"
  },
  {
    "id": "grup-2ab77284-4bdd-4e0d-bc9b-e8731ae9536e",
    "name": "Saluran All Testimoni Pionz",
    "image": "https://api.heyyami.web.id/api/media/42da16eee5ad5d6594c749cb9a10948105e00bf45cffba3b.webp",
    "url": "https://whatsapp.com/channel/0029VbCtccs6GcGFguxmt30B"
  },
  {
    "id": "grup-2ed31a2b-13e1-4461-ae3d-4849c98a649b",
    "name": "Tiktok",
    "image": "https://api.heyyami.web.id/api/media/498833bbfd6c18ce7eee038a252ef6effce8e038aa03ddfb.webp",
    "url": "https://www.tiktok.com/@heyyami.id?_r=1&_t=ZS-99zI2R2jd6W"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    "id": "testi-1",
    "buyerName": "Rian Pratama",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    "accountBought": "PRIME 7 Evo 8 max 2 otw 3",
    "game": "Free Fire",
    "price": 800000,
    "date": "Kemarin, 20:45 WIB",
    "comment": "Mantap banget min! Akun langsung masuk, rebind ke email gmail saya dibimbing sampai selesai tanpa kendala. Admin Pionz Store ramah & fast respon!",
    "rating": 5,
    "imageProof": "https://api.heyyami.web.id/api/media/30c37843ddcf703bd3c2d1ecf5378616a60822d5d916234b.webp",
    "verified": true
  },
  {
    "id": "testi-2",
    "buyerName": "Dimas Arya",
    "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
    "accountBought": "Jenggot bnl gagah ini Max 1 ft sg2 rapper",
    "game": "Free Fire",
    "price": 500000,
    "date": "2 hari lalu",
    "comment": "Awalnya ragu beli akun online, tapi setelah coba di Pionz Store lewat admin rekber ternyata amanah 100%. Jangan ragu belanja di sini rekomen!",
    "rating": 5,
    "imageProof": "https://api.heyyami.web.id/api/media/253915194e1fc58877199f62da67be45434fd16384fddc40.webp",
    "verified": true
  },
  {
    "id": "testi-3",
    "buyerName": "Bagus Setiawan",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    "accountBought": "Receh gagah ni sg2 otw max (Dana Pelajar)",
    "game": "Free Fire",
    "price": 150000,
    "date": "3 hari lalu",
    "comment": "Harga pelajar tapi spek dewa! Proses cepat cuma 10 menitan akun udah aman ditangan. Makasih Pionz Store sukses selalu.",
    "rating": 5,
    "imageProof": "https://api.heyyami.web.id/api/media/ce780d40f6dcf6a9ebd4cbd41670f3a418ee503219822442.webp",
    "verified": true
  },
  {
    "id": "testi-4",
    "buyerName": "Fajar Maulana",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    "accountBought": "Ragnarok gagah nih PRIME 6",
    "game": "Free Fire",
    "price": 550000,
    "date": "4 hari lalu",
    "comment": "Admin fast respon, rekber aman joss. Garansi rebind beneran dikawal sampai beres.",
    "rating": 5,
    "imageProof": "https://api.heyyami.web.id/api/media/f27f79252829f938f615f898d5a5c43ec973c0034a6913bc.webp",
    "verified": true
  },
  {
    "id": "testi-5",
    "buyerName": "Aldi Kurniawan",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    "accountBought": "Evo 2 otw max 1 Sg2 evo lvl 5",
    "game": "Free Fire",
    "price": 200000,
    "date": "5 hari lalu",
    "comment": "Proses kilat, langsung serah terima dan rebind email no ribet.",
    "rating": 5,
    "imageProof": "https://api.heyyami.web.id/api/media/bf76688aa915aebe7300f4099ec27f593b10610829c706db.webp",
    "verified": true
  },
  {
    "id": "testi-6",
    "buyerName": "Rizky Ramadhan",
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80",
    "accountBought": "Epas 8/10 on Scar max ft sg2",
    "game": "Free Fire",
    "price": 300000,
    "date": "6 hari lalu",
    "comment": "Transaksi amanah rekber terpercaya. Sukses terus Pionz Store!",
    "rating": 5,
    "imageProof": "https://api.heyyami.web.id/api/media/b8ccc3b83ac353c4d1ae5cd0fd0ae2075b56dbfc46ce6f83.webp",
    "verified": true
  }
];

export const FAQS: FAQItem[] = [
  {
    "question": "Bagaimana cara membeli akun di Pionz Store?",
    "answer": "1. Pilih akun yang Anda minati di katalog Pionz Store.\n2. Klik tombol \"Beli Sekarang via WhatsApp\".\n3. Format pesan otomatis akan terisi dengan ID dan link akun yang dipilih.\n4. Admin Pionz Store akan memverifikasi ketersediaan stok & memberikan nomor rekening resmi.\n5. Setelah transfer, admin membimbing proses pengamanan (rebind) akun ke email & nomor HP pribadi Anda sampai selesai 100% aman.",
    "category": "Transaksi"
  },
  {
    "question": "Apa itu garansi akun dan bagaimana proses transaksinya?",
    "answer": "Garansi akun adalah jaminan bahwa akun Free Fire yang Anda beli sepenuhnya dipindahkan ke data pribadi Anda dengan transaksi aman. Pionz Store memberikan garansi akun dan pendampingan bantuan admin sampai proses serah terima tuntas dan aman 100%.",
    "category": "Garansi"
  },
  {
    "question": "Apakah bisa booking atau bayar DP (Uang Muka) dulu?",
    "answer": "Bisa! Untuk akun tertentu Anda dapat melakukan booking dengan DP mulai dari Rp 50.000 - Rp 100.000 tergantung harga akun. Batas waktu pelunasan disepakati bersama admin.",
    "category": "Pembayaran"
  },
  {
    "question": "Apa arti status \"SOLD DI DP (TIKUNG LANGSUNG CHAT ADMIN)\"?",
    "answer": "Artinya akun sedang di-booking oleh calon pembeli namun belum dilunasi. Jika ada pembeli lain yang ingin melunasi langsung (menikung), Anda bisa langsung konfirmasi ke admin untuk kemungkinan serah terima jika batas waktu DP habis.",
    "category": "Status Akun"
  },
  {
    "question": "Metode pembayaran apa saja yang diterima?",
    "answer": "Pionz Store menerima QRIS (Semua e-wallet & mobile banking), Transfer Bank (BCA, BRI, BNI, Mandiri, Seabank), serta E-Wallet (DANA, OVO, GoPay, ShopeePay).",
    "category": "Pembayaran"
  },
  {
    "question": "Berapa jam operasional admin Pionz Store?",
    "answer": "Admin Pionz Store aktif setiap hari mulai pukul 09.00 WIB hingga 23.00 WIB. Pesanan di luar jam operasional akan diproses segera saat admin online.",
    "category": "Operasional"
  }
];
