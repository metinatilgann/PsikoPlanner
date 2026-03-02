# Gizlilik Politikasi / Privacy Policy

**Son Guncelleme / Last Updated:** 2026-02-26

---

## TURKCE

### 1. Giris

PsikoPlanner, terapistler icin gelistirilmis profesyonel bir pratik yonetim uygulamasidir. Bu gizlilik politikasi, uygulamanin topladigi, sakladigi ve isleme tabi tuttugu veriler hakkinda sizi bilgilendirmek amaciyla hazirlanmistir.

**Gelistirici:** PsikoPlanner
**Iletisim:** psikoplanner@gmail.com

### 2. Toplanan Veriler

#### 2.1 Hesap Verileri
- E-posta adresi (giris ve kayit icin)

#### 2.2 Terapist Profil Verileri
- Ad soyad, unvan, lisans numarasi, klinik bilgileri

#### 2.3 Danisan Kisisel Verileri
- Ad, soyad, telefon, e-posta, dogum tarihi, cinsiyet, TC kimlik numarasi
- Uyruk, meslek, medeni durum, egitim durumu
- Adres, sehir, yasam duzeni
- Acil durum iletisim bilgileri

#### 2.4 Saglik Verileri (Hassas)
- Kronik hastalik bilgileri, kullanilan ilaclar, alerji bilgileri
- Tibbi gecmis (ameliyatlar, fiziksel sikayetler, uyku duzeni, madde kullanimi)
- Norolojik gecmis, bas yaralanmalari

#### 2.5 Psikolojik Veriler (Hassas)
- Onceki tani ve tedaviler, hastane yatislari
- Intihar/kendine zarar verme gecmisi, travma gecmisi
- Basa cikma mekanizmalari, aile psikiyatrik oykusu
- Terapi beklentileri ve hedefleri

#### 2.6 Seans Verileri
- Seans tarihleri, turleri, notlari (SOAP formati)
- Degerlendirmeler, risk seviyeleri, terapotik teknikler

#### 2.7 Finansal Veriler
- Seans ucretleri, odeme durumu (kredi karti/banka bilgisi TOPLANMAZ)

### 3. Verilerin Saklanmasi

- **Danisan verileri (saglik, psikolojik, seans, kisisel):** Tamamen cihazinizda yerel olarak SQLite veritabaninda saklanir. Bu veriler hicbir sunucuya gonderilmez ve cihazinizdan cikmaz.
- **Kimlik dogrulama verileri:** E-posta ve oturum bilgileri Supabase uzerinden islenir (AWS altyapisi).
- **Hassas kimlik bilgileri:** Cihazin guvenli deposunda (Secure Store/Keychain) saklanir.

### 4. Veri Paylasimi

- Danisan verilerinizi hicbir ucuncu tarafla paylasmayiz.
- Uygulamada reklam SDK'si, analitik araci veya izleme teknolojisi BULUNMAZ.
- Saglik ve terapi verileri cihazinizdan ASLA cikmaz.
- Tek dis baglanti: Kimlik dogrulama icin Supabase (yalnizca e-posta/sifre).

### 5. Veri Saklama Suresi

- Veriler, siz silene kadar cihazinizda saklanir.
- Uygulamayi kaldirmak tum yerel verileri siler.
- Supabase kimlik dogrulama kayitlari Supabase'in saklama politikasina tabidir.

### 6. Kullanici Haklari (KVKK / GDPR)

6698 sayili Kisisel Verilerin Korunmasi Kanunu (KVKK) ve Genel Veri Koruma Yonetmeligi (GDPR) kapsaminda asagidaki haklara sahipsiniz:

- **Erisim hakki:** Verilerinize erisim talep edebilirsiniz.
- **Duzeltme hakki:** Yanlis verilerin duzeltilmesini isteyebilirsiniz.
- **Silme hakki:** Tum verilerinizin silinmesini talep edebilirsiniz.
- **Tasinabilirlik hakki:** Verilerinizi yedekleme/disari aktarma ozelligiyle tasiyabilirsiniz.
- **Itiraz hakki:** Veri islemeye itiraz edebilirsiniz.
- **Rizayi geri cekme hakki:** Verdiginiz izinleri istediginiz zaman geri cekebilirsiniz.

Bu haklarinizi kullanmak icin psikoplanner@gmail.com adresine basvurabilirsiniz.

### 7. Guvenlik Onlemleri

- Yerel veri depolama (bulut senkronizasyonu yok)
- Biyometrik kimlik dogrulama (parmak izi / yuz tanima)
- Otomatik kilitleme ozelligi
- Guvenli kimlik bilgisi depolama (Secure Store)
- Tum ag iletisimlerinde HTTPS kullanimi

### 8. Cocuklarin Gizliligi

PsikoPlanner, 13 yasindan kucuk cocuklara yonelik degildir. Uygulama, lisansli terapistler icin profesyonel bir aractir.

### 9. Degisiklikler

Bu gizlilik politikasinda yapilacak degisiklikler uygulama icinden bildirilecektir. Guncel politikayi her zaman uygulama icerisinden goruntuleyebilirsiniz.

### 10. Iletisim

Sorulariniz icin: psikoplanner@gmail.com

---

## ENGLISH

### 1. Introduction

PsikoPlanner is a professional practice management application designed for therapists. This privacy policy describes the data the application collects, stores, and processes.

**Developer:** PsikoPlanner
**Contact:** psikoplanner@gmail.com

### 2. Data We Collect

#### 2.1 Account Data
- Email address (for login and registration)

#### 2.2 Therapist Profile Data
- Name, title, license number, clinic information

#### 2.3 Client Personal Data
- Name, phone, email, date of birth, gender, national ID
- Nationality, occupation, marital status, education level
- Address, city, living situation
- Emergency contact information

#### 2.4 Health Data (Sensitive)
- Chronic illness information, current medications, allergy information
- Medical history (surgeries, physical complaints, sleep patterns, substance use)
- Neurological history, head injuries

#### 2.5 Psychological Data (Sensitive)
- Previous diagnoses and treatments, hospitalizations
- Suicide/self-harm history, trauma history
- Coping mechanisms, family psychiatric history
- Therapy expectations and goals

#### 2.6 Session Data
- Session dates, types, notes (SOAP format)
- Evaluations, risk levels, therapeutic techniques

#### 2.7 Financial Data
- Session fees, payment status (credit card/bank info is NOT collected)

### 3. Data Storage

- **Client data (health, psychological, session, personal):** Stored entirely on your device locally using SQLite database. This data is never sent to any server and never leaves your device.
- **Authentication data:** Email and session tokens are processed through Supabase (AWS infrastructure).
- **Sensitive credentials:** Stored in the device's secure enclave (Secure Store/Keychain).

### 4. Data Sharing

- We do not share your client data with any third party.
- The application contains NO advertising SDKs, analytics tools, or tracking technologies.
- Health and therapy data NEVER leaves your device.
- The only external connection is Supabase for authentication (email/password only).

### 5. Data Retention

- Data persists on your device until you explicitly delete it.
- Uninstalling the application removes all local data.
- Supabase authentication records follow Supabase's retention policy.

### 6. User Rights (KVKK / GDPR)

Under the Turkish Personal Data Protection Law (KVKK) and General Data Protection Regulation (GDPR), you have the following rights:

- **Right of access:** You may request access to your data.
- **Right to rectification:** You may request correction of inaccurate data.
- **Right to erasure:** You may request deletion of all your data.
- **Right to portability:** You may export your data using the backup feature.
- **Right to object:** You may object to data processing.
- **Right to withdraw consent:** You may withdraw your consent at any time.

To exercise these rights, contact psikoplanner@gmail.com.

### 7. Security Measures

- Local data storage (no cloud synchronization)
- Biometric authentication (fingerprint / face recognition)
- Auto-lock feature
- Secure credential storage (Secure Store)
- HTTPS for all network communications

### 8. Children's Privacy

PsikoPlanner is not directed at children under 13. The application is a professional tool for licensed therapists.

### 9. Changes

Changes to this privacy policy will be communicated through the application. You can always view the current policy within the app.

### 10. Contact

For questions: psikoplanner@gmail.com
