import { motion } from 'framer-motion';
import { Music, Headphones, Mic2, Radio, Music2 } from 'lucide-react';

const FloatingMusicIcons = () => {
  const icons = [
    { Icon: Music, x: '10%', y: '15%', delay: 0, duration: 8 },
    { Icon: Headphones, x: '75%', y: '25%', delay: 1, duration: 10 },
    { Icon: Mic2, x: '20%', y: '60%', delay: 2, duration: 12 },
    { Icon: Radio, x: '85%', y: '70%', delay: 0.5, duration: 9 },
    { Icon: Music2, x: '50%', y: '40%', delay: 1.5, duration: 11 },
    { Icon: Music, x: '65%', y: '75%', delay: 2.5, duration: 10 },
    { Icon: Headphones, x: '30%', y: '30%', delay: 3, duration: 13 },
    { Icon: Mic2, x: '90%', y: '40%', delay: 1, duration: 8 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.06]">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut',
          }}
        >
          <item.Icon className="h-16 w-16 text-white sm:h-20 sm:w-20 md:h-24 md:w-24" />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingMusicIcons;
