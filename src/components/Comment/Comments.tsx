import { comments } from "@app/constants/options";
import Image from "next/image";
import React from "react";

const Comments = () => {
  return (
    <>
      {comments.map((comment, index) => (
        <div key={index} className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={comment.userProfile}
                alt="commented-user-profile-picture"
                width={500}
                height={500}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <p className="text-sm text-gray-600">{comment.user}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-700">{comment.title}</p>
            <button className="text-xs text-gray-500"> Reply</button>
          </div>

          {comment.children && (
            <div className="ml-2 pl-2 mt-2 border-l border-dashed border-gray-400">
              <p className="text-sm text-gray-700"> {comment.children.title}</p>
              <button className="text-xs text-gray-500"> Reply</button>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default Comments;
