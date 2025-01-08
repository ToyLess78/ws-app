export const getRandomAvatar = (): string => {
  const randomNumber = Math.floor(Math.random() * 20) + 5;
  return `./avatars/u-${randomNumber}.webp`;
};
