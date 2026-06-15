const unsplashIds = [
  '1544716278-ca2e3f4ab2b5',
  '1524995997946-a1c2e315a42f',
  '1532012197267-da84d127e765',
  '1495446815901-a7297e633e8d',
  '1512820790803-83ca734da794',
  '1507842217343-583bb7270b66',
  '1481627834876-b7833e8f5570',
  '1491841573634-28140fc7ced7',
  '1589998059171-988d887df646',
  '1456513080510-7bf3a84b82f8',
  '1474936370473-36364d406f7f',
  '1497633762265-9d179a990aa6',
  '1524578271613-d550e8f6090a',
  '1521587760476-6c12a4b040da',
  '1595193811269-7f2f5e4ae509',
  '1491300125923-3f5e7e9e7e0e',
  '1519682308655-3f1a5e8a6b8c',
  '1553729459-0b8e7c8b6f1a',
];

const hash = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

export const getCoverUrl = (title, size = '200,300') => {
  const idx = hash(title) % unsplashIds.length;
  return `https://images.unsplash.com/photo-${unsplashIds[idx]}?w=${size.split(',')[0]}&h=${size.split(',')[1]}&fit=crop&auto=format`;
};

export const getDetailCover = (title) => getCoverUrl(title, '300,400');
export const getThumbCover = (title) => getCoverUrl(title, '80,120');
