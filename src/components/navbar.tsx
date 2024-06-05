import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="p-2 w-full bg-bgPrimary">
      <div className="flex items-center gap-2">
        <Menu
          className="text-sm text-sdzBlue100 cursor-pointer"
          width={20}
          height={20}
        />
        <Link href={"/"}>
          <Image src={"/assets/logo.png"} width={150} alt="logo" height={150} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
