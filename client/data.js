export const initialForm = {
  email: 'Email',
  name: 'Ad',
  lastname: 'Soyad',
  university: 'Üniversite',
  universityYear: 'Üniversite Yılı',
  universityDept: 'Bölüm (ve varsa çift ana dal veya yan dal)',
  gpa: 'GPA',
  cv: 'CV',
  cvAnon: 'CV (anonim)',
  transcript: 'Transcript',
  transcriptAnon: 'Transcript (anonim)',
  internshipCountry: 'Staj yapılacak ülke',
  internshipType: 'Staj programı türü',
  companyName: 'Staj yapılacak kuruluşun adı',
  internshipPeriod: 'Staj süresi (hafta)',
  internshipPosition: 'Staj yapılacak pozisyon / görev tanımı',
  acceptanceLetter:
    'Staj yapılacak kuruluştan veya çalışılacak kişiden, staja kabul aldığını ve ödeme almayacağını onaylayan imzalı yazı',
  acceptanceEmail: 'Belgeyi imzalayan kuruluşun / kişinin e-maili',
  economicSupport:
    'Staj yapacağın kuruluş dışında bir kuruluştan hibe/burs alıyor musun?',
  economicSupportQ2: 'Hangi kuruluştan, ne kadar maddi destek alıyorsun?',
  longQuestion1:
    'Staj yapacağın kurumu seçmende hangi faktörler etkili oldu? Sence bu kurumu benzerlerinden ayıran özellikleri neler? (max. 150 kelime)',
  longQuestion2:
    'Bu stajdan neler öğrenmeyi, hangi yeterlilikleri kazanmayı bekliyorsun? (max. 200 kelime) Not: Son iki sorunun yanıtı başvurunun puanlamasında ciddi ağırlığa sahip olacak, özenle doldurmanı tavsiye ediyoruz :)',
  longQuestion3:
    'Bu stajın sana kariyer hedeflerin doğrultusunda ve hayat tecrübesi anlamında neler katacağını düşünüyorsun? Stajını başarıyla tamamlaman halinde kariyerine ilişkin bir sonraki hedefine ne olacak? (max. 200 kelime)',
  ourPrograms:
    'Kesişen Yollar Danışmanlık Programı veya Kariyer Sohbetlerinden haberdar mısın? Danışmanlık Programına dahilsen veya Kariyer Sohbetlerini takip ediyorsan, ne sıklıkla takip ediyorsun? Programları faydalı buluyor musun? Bu soru başvuru değerlendirmeni etkilemeyecek, ama son bir gayret max. bir kaç dk. ayırıp bu soruyu da samimi şekilde cevaplamanı rica ediyoruz :)',
  aboutUs: 'Yurt Dışında Staj Programından nasıl haberdar oldun?',
  notes: 'Notlar',
  createdAt: 'Başvuru Tarihi',
  updatedAt: 'Güncelleme Tarihi'
};

export const isAFile = [
  'cv',
  'cvAnon',
  'transcript',
  'transcriptAnon',
  'acceptanceLetter'
];
export const user = {
  email: 'Email',
  name: 'İsim'
  // permissions: 'Yetkiler'
};

export const possiblePermissions = ['ADMIN', 'JURY', 'RESULTS'];

export const resultConst = {
  email: 'Email',
  name: 'Ad',
  lastname: 'Soyad',
  total_score: 'Toplam Puan'
};

export const resultPartial = {
  score: 'Puan',
  yn: 'E/H',
  notes: 'Notlar'
};

export const resultJuryPattern = [
  'id',
  'email',
  'name',
  'lastname',
  'total_score'
];

export const isADateTime = ['createdAt', 'updatedAt'];
