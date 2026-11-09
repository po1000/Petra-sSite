"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

// Glossy bubble cursor. Only runs on devices with a mouse/trackpad;
// phones and tablets keep their normal touch behaviour.
export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const tx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.6 });
  const ty = useSpring(y, { stiffness: 180, damping: 18, mass: 0.6 });
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-bubble");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as Element | null;
      setHover(!!t?.closest?.("a, button, select, summary, label, [role=button]"));
    };
    const hide = () => setVisible(false);
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      document.documentElement.classList.remove("has-bubble");
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = hover ? 34 : 20;
  return (
    <>
      {/* trailing see-through bubble */}
      <motion.div className="pointer-events-none fixed left-0 top-0 z-[200]" style={{ x: tx, y: ty }} aria-hidden>
        <motion.div className="soap" style={{ x: "-50%", y: "-50%" }} animate={{ width: hover ? 54 : 12, height: hover ? 54 : 12, opacity: visible ? 0.9 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
      </motion.div>
      {/* main glossy bubble */}
      <motion.div className="pointer-events-none fixed left-0 top-0 z-[201]" style={{ x, y }} aria-hidden>
        <motion.div className="bubble" style={{ x: "-50%", y: "-50%" }} animate={{ width: size, height: size, opacity: visible ? 1 : 0, scale: down ? 0.75 : 1 }} transition={{ type: "spring", stiffness: 400, damping: 22 }} />
      </motion.div>
    </>
  );
}
