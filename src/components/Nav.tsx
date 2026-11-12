import PixelIcon from "./PixelIcon";

export const navItems = [
  // eslint-disable-next-line @next/next/no-img-element
  { href: "/", label: "home", icon: <img src="/logo-sm.png" alt="" className="pix h-14 md:h-16 w-auto" style={{ imageRendering: "auto" }} /> },
  { href: "/shop", label: "store", icon: <PixelIcon name="cart" className="w-16 md:w-20" /> },
  { href: "/archive", label: "archive", icon: <PixelIcon name="camera" className="w-16 md:w-20" /> },
  { href: "/info", label: "info", icon: <PixelIcon name="papers" className="w-12 md:w-14" /> },
];
