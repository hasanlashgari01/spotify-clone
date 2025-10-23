import { motion } from "framer-motion";
import DefaultPicture from "../../../../public/default-avatar.webp";

type SingleProps = {
  playlistName: string;
  playlistSongs: string;
  fullimize: boolean;
  cover: string;
  index: number;
  hoverIndex: number | null;
  setHoverIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

const SinglePlaylist = ({
  playlistName,
  playlistSongs,
  cover,
  fullimize,
  index,
  hoverIndex,
  setHoverIndex,
}: SingleProps) => {
  // فاصله آیتم نسبت به آیتم هاور شده
  const distance = hoverIndex === null ? Infinity : Math.abs(index - hoverIndex);

  // تنظیمات حرکت افقی (x) بر اساس فاصله
  // فاصله 0 => آیتم هاور شده (بیشترین جابجایی به سمت چپ)
  // فاصله 1 => همسایه‌ها (جابجایی کمتر)
  // بقیه => بدون جابجایی
  const x =
    distance === 0 ? 28 : // آیتم مرکزی یک مقدار بزرگتر به چپ میره (px)
    distance === 1 ? 14 : // همسایه‌ها یک مقدار کوچکتر
    0;

  return (
    <motion.div
      onMouseEnter={() => setHoverIndex(index)}
      onMouseLeave={() => setHoverIndex(null)}
      animate={{ x }}
      transition={{ type: "spring", stiffness: 380, damping:50 }}
      className="w-full flex items-center justify-start px-2 cursor-pointer"
      style={{ originX: 0 }} 
    >
      <motion.img
        src={cover || DefaultPicture}
        alt={playlistName}
        className="h-12 w-12 object-cover rounded-lg shadow-sm"
        whileHover={{ rotate: 2 }}
        transition={{ duration: 0.18 }}
      />

      
      
    </motion.div>
  );
};

export default SinglePlaylist;
