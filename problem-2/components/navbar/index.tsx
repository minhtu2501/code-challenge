import React from 'react';
import AccountState from './account-state';
import Image from 'next/image';
import { LogoSvg } from '@/public/images';

const Navbar: React.FC = () => {
  return (
    <nav className="px-4 md:container flex flex-row items-center w-full h-16">
      <div className="flex-1 flex flex-row items-center gap-4">
        <Image src={LogoSvg} alt="app logo" width={40} height={40} />
        <span className="text-3xl text-primary font-bold">Swap</span>
      </div>
      <div className="flex flex-row gap-2">
        <AccountState />
      </div>
    </nav>
  );
};

export default Navbar;
