import { motion } from 'motion/react';

interface MamiTheBeanProps {
  top: number;
  left: number;
  size: number;
  rotate: number;
  scale?: number;
}

function MamiTheBean({ top, left, size, rotate, scale }: MamiTheBeanProps) {
  return (
    <motion.div className="mami-bean"
      style={{
        position: 'absolute',
        top,
        left,
        width: "100%",
        maxWidth: size,
        maxHeight: size,
      }}
      initial={{
        rotate: '0deg',
        scale: scale || 1,
      }}
      animate={{
        rotate: `20deg`,
        transition: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.15,
          ease: [0.4, 0, 0.2, 1],
          // type: "spring",
        },
      }}
    >
      <motion.img src="/mami/MamiTheBean.png" alt="Mami The Bean"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}

        initial={{
          rotate,
        }}
      />
    </motion.div>
  );
}

export default MamiTheBean;