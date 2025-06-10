
import Image from 'next/image';
import React from 'react'
import loadingGif from "../assets/loading.gif";
const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Image src={loadingGif} alt="Loading..." width={220} height={220} />
    </div>
  );
}

export default Loading