const firstNames = ["Emre", "Ekin", "Aylin", "Kerem", "Elif", "Burak", "Derya", "Canan", "Mert", "Selin", "Ozan"];
const lastNames = ["Yılmaz", "Albeni", "Demir", "Kaya", "Şahin", "Arslan", "Öztürk", "Aydın", "Yıldırım", "Koç", "Çelik"];


export const getRandomName = () => {
  const randomName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomSurname = lastNames[Math.floor(Math.random() * lastNames.length )];

  return `${randomName} ${randomSurname}`;
};