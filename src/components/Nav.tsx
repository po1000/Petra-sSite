import PixelIcon from "./PixelIcon";

export const navItems = [
  { href: "/", label: "home", icon: <div className="bubble pix w-14 h-14 md:w-16 md:h-16" /> },
  { href: "/shop", label: "store", icon: <PixelIcon name="cart" className="w-16 md:w-20" /> },
  { href: "/archive", label: "archive", icon: <PixelIcon name="camera" className="w-16 md:w-20" /> },
  { href: "/info", label: "info", icon: <PixelIcon name="papers" className="w-12 md:w-14" /> },
];
