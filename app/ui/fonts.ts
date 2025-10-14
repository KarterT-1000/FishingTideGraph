import { Inter } from 'next/font/google';
import { Noto_Sans_JP } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

export const notoSans = Noto_Sans_JP({
    weight: ['400', '700'],
    style: ['normal'],
    display: 'swap'
});