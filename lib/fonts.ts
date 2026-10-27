import localFont from 'next/font/local';

export const cormorant = localFont({
  src: [
    {
      path: '../public/fonts/CormorantGaramond-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/CormorantGaramond-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/CormorantGaramond-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-cormorant',
  display: 'swap',
});

export const pretendard = localFont({
  src: [
    {
      path: '../public/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});

export const gowunBatang = localFont({
  src: [
    {
      path: '../public/fonts/GowunBatang-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/GowunBatang-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-gowun-batang',
  display: 'swap',
});

export const blackHanSans = localFont({
  src: [
    {
      path: '../public/fonts/BlackHanSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-black-han-sans',
  display: 'swap',
});
