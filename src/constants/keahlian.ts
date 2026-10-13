export type KeahlianGroup = { huruf: string; items: string[] };

// Daftar keahlian dikelompokkan menurut huruf awal nama keahlian (A–Z),
// dan diurutkan abjad di dalam tiap huruf.
// Kalau ada yang kurang atau salah tulis, cukup ubah di sini:
// tambahkan nama keahlian ke kelompok huruf yang sesuai, atau buat kelompok baru.
export const keahlianGroups: KeahlianGroup[] = [
  {
    huruf: "A",
    items: [
      "Alat Berat & Mesin Industri",
      "Alih Daya Proses Bisnis",
      "Asuransi",
    ],
  },
  {
    huruf: "B",
    items: [
      "Bahan Bangunan & Sanitasi",
      "Barang Industri & Bahan Kimia",
      "Barang Konsumsi Cepat Habis",
    ],
  },
  {
    huruf: "E",
    items: ["Elektronik Konsumen, Peralatan Rumah Tangga & Perabotan"],
  },
  {
    huruf: "H",
    items: ["Hiburan"],
  },
  {
    huruf: "J",
    items: ["Jasa Pindahan"],
  },
  {
    huruf: "K",
    items: [
      "Kecantikan & Kebugaran",
      "Konglomerasi / Perusahaan Induk",
      "Konsultasi (Bisnis & Manajemen)",
      "Konsultasi (TI & Ilmu Teknologi)",
      "Konsultasi, Penelitian & Layanan Hukum",
    ],
  },
  {
    huruf: "L",
    items: [
      "Layanan Lainnya",
      "Layanan Lingkungan & Fasilitas",
    ],
  },
  {
    huruf: "M",
    items: [
      "Makanan & Minuman",
      "Manufaktur Elektronik",
      "Manufaktur Lainnya",
      "Manufaktur Mekanikal / Elektrikal",
      "Media, Hiburan & Periklanan",
    ],
  },
  {
    huruf: "O",
    items: ["Otomotif & Komponen"],
  },
  {
    huruf: "P",
    items: [
      "Pakaian, Tekstil & Mode",
      "Pelayaran / Pengiriman",
      "Pemerintah, Nirlaba & Fasilitas Publik",
      "Pemrosesan Sumber Daya Alam",
      "Pendidikan & Pelatihan",
      "Perangkat Lunak Komputer",
      "Perawatan Kesehatan & Farmasi",
      "Perbankan & Layanan Keuangan",
      "Percetakan & Penerbitan",
      "Percetakan & Pengemasan",
      "Perdagangan",
      "Perdagangan Eceran & Grosir",
      "Perdagangan Komoditas",
      "Perhiasan & Barang Mewah",
      "Perhotelan, Perjalanan & Pariwisata",
      "Permen / Kembang Gula",
      "Pertambangan, Minyak & Gas",
      "Pertanian, Perikanan & Perkebunan",
      "Produk Kertas & Kehutanan",
      "Produk Kulit",
      "Pupuk & Pestisida",
    ],
  },
  {
    huruf: "R",
    items: [
      "Real Estat & Properti",
      "Rekayasa, Pengadaan, Konstruksi",
      "Rekreasi",
      "Restoran & Layanan Makanan",
    ],
  },
  {
    huruf: "S",
    items: [
      "Sains & Teknologi",
      "Sepatu",
      "Sumber Daya Alam, Lainnya",
    ],
  },
  {
    huruf: "T",
    items: [
      "Teknologi Keuangan",
      "Tembakau & Rokok",
      "TI & Telekomunikasi",
      "TI / Perangkat Keras Komputer",
      "Tidak Disebutkan",
      "Transportasi & Logistik",
    ],
  },
  {
    huruf: "U",
    items: ["Utilitas & Energi"],
  },
];