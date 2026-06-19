import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function MouseFollower() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTouch, setActiveTouch] = useState(false);

  // High performance MotionValues to bypass React re-renders
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Springs for smooth fluid following trail of the outer glow ring
  const springConfig = { damping: 35, stiffness: 300, mass: 0.5 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  // Secondary spring configuration for a more gelatinous velocity tracking
  const scaleX = useSpring(1, { damping: 25, stiffness: 180 });
  const scaleY = useSpring(1, { damping: 25, stiffness: 180 });
  const rotate = useSpring(0, { damping: 25, stiffness: 180 });

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let velocityTimeout: any = null;

    const handleMouseMove = (e: MouseEvent) => {
      // If we move the mouse, we are using a cursor (even on hybrid touchscreen laptops)
      setActiveTouch(false);
      
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      // Simple velocity and vector rotation formula for premium gelatinous stretching
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Update last coordinates
      lastX = e.clientX;
      lastY = e.clientY;

      if (speed > 1) {
        // High motion velocity stretches and angles the liquid follower
        const maxStretch = 1.4;
        const stretchAmount = Math.min(1 + speed * 0.005, maxStretch);
        const squeezeAmount = Math.max(1 - speed * 0.0025, 0.7);

        scaleX.set(stretchAmount);
        scaleY.set(squeezeAmount);

        // Vector angle rotation to face the direction of movement
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        rotate.set(angle);

        // Clear previous timeout and set a new one to return to normal scale when mouse stops
        if (velocityTimeout) clearTimeout(velocityTimeout);
        velocityTimeout = setTimeout(() => {
          scaleX.set(1);
          scaleY.set(1);
        }, 100);
      } else {
        scaleX.set(1);
        scaleY.set(1);
      }
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    // If a touch starts, hide the mouse follower immediately to avoid double cursor on mobile
    const handleTouchStart = () => {
      setActiveTouch(true);
      setIsVisible(false);
    };

    // Global event delegation for interactive hovering (magnetic feeling expansion)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const hoverable = target.closest(
        "a, button, [role='button'], .cursor-pointer, input, textarea, select"
      );

      if (hoverable) {
        setIsHovered(true);
        // Expand spring stretching values scale on hover (makes it round and large)
        scaleX.set(1.6);
        scaleY.set(1.6);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const hoverable = target.closest(
        "a, button, [role='button'], .cursor-pointer, input, textarea, select"
      );

      if (hoverable) {
        setIsHovered(false);
        scaleX.set(1);
        scaleY.set(1);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      if (velocityTimeout) clearTimeout(velocityTimeout);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [mouseX, mouseY, isVisible, rotate, scaleX, scaleY]);

  // Hide follower on touch-only actions or before first movement
  if (activeTouch || !isVisible) return null;

  return (
    <>
      {/* Outer Glow Trail (Liquid Floating Ring Aura) */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          scaleX: scaleX,
          scaleY: scaleY,
          rotate: rotate,
          width: isHovered ? 44 : 24,
          height: isHovered ? 44 : 24,
        }}
        animate={{
          backgroundColor: isHovered ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
          borderColor: isHovered ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.35)",
          borderWidth: isHovered ? "1px" : "1.5px",
          boxShadow: isHovered
            ? "0 0 25px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.4), inset 0 0 4px rgba(255, 255, 255, 0.15)"
            : "0 0 15px rgba(255, 255, 255, 0.25), 0 0 5px rgba(255, 255, 255, 0.1)",
        }}
        transition={{
          backgroundColor: { duration: 0.25 },
          borderColor: { duration: 0.25 },
          borderWidth: { duration: 0.2 },
          boxShadow: { duration: 0.25 },
          width: { type: "spring", damping: 25, stiffness: 220 },
          height: { type: "spring", damping: 25, stiffness: 220 },
        }}
      />
    </>
  );
}
