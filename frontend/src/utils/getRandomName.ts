const firstNames = [
  "Emre", "Ekin", "Büşra", "Aylin", "Kerem", "Elif", "Burak", "Derya", 
  "Canan", "Mert", "Selin", "Melike", "Mina", "Zeynep", "Polat", "Umut", 
  "Kuzey", "Ozan", "Deniz", "Ada", "Yiğit", "Irmak", "Sarp", "Pelin", "Volkan", "Beren", "Gökhan", "Eylül", "Sinan", "Damla", "Kaan", "Simge", "Barış", "Öykü", "Tuna", "Azra", "Doruk", "Defne"
];

const lastNames = [
  "Yılmaz", "Albeni", "Kaya", "Demir", "Şahin", "Arslan", "Öztürk", 
  "Aydın", "Yıldırım", "Koç", "Çelik", "Kurt", "Özkan", "Bulut", "Güneş", "Yavuz", "Erdoğan", "Aksoy", "Çetin", "Kara", "Polat", "Özcan", "Korkmaz", "Aslan", "Güler", "Yüksel", "Sarı", "Tekin", "Taş", "Güneş", "Avcı"
];


export const getRandomName = () => {
  const randomName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomSurname = lastNames[Math.floor(Math.random() * lastNames.length )];

  return `${randomName} ${randomSurname}`;
};