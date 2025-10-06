import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';

/**
 * 
 *  // <div className="mx-[20px] flex h-[300px] items-center justify-center bg-[#101720] sm:mx-[64px] sm:h-[333px]">
    //   <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
    // </div>
 * @returns 
 */

const Loading = () => {
  return (
    <div className="group relative flex flex-col items-center overflow-hidden">
      {' '}
      <div className="relative h-[120px] w-[120px] rounded-xl sm:h-[150px] sm:w-[150px] md:h-[210px] md:w-[210px]">
        {' '}
        <Skeleton
          height="100%"
          width="100%"
          borderRadius={12}
          baseColor="#1574f5"
          highlightColor="#101721"
        />
             {' '}
      </div>
           {' '}
      <div className="mt-2 w-[100px] sm:w-[130px] md:w-[150px]">
               {' '}
        <Skeleton height={16} baseColor="#1574f5" highlightColor="#101721" />
             {' '}
      </div>
         {' '}
    </div>
  );
};

export default Loading;
