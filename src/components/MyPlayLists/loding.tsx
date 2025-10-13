import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Loading = () => {
  return (
    <div className="group relative flex flex-col items-center overflow-hidden">
      <div className="relative h-[120px] w-[120px] rounded-xl sm:h-[150px] sm:w-[150px] md:h-[210px] md:w-[210px]">
        <Skeleton
          height="100%"
          width="100%"
          borderRadius={12}
          baseColor="#1574f5"
          highlightColor="#101721"
        />
      </div>
      <div className="mt-2 w-[100px] sm:w-[130px] md:w-[150px]">
        <Skeleton height={16} baseColor="#1574f5" highlightColor="#101721" />
      </div>
    </div>
  );
};

export default Loading;
