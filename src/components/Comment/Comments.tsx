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
            <div className="w-40 h-40 rounded-2xl border overflow-hidden my-2">
              <Image
                src={comment.image}
                alt="comment-image"
                width={1000}
                height={1000}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <button className="text-xs text-gray-500"> Reply</button>
          </div>

          {comment.children && (
            <>
              <div className="ml-2 p-2 mt-2 border-l border-dashed border-gray-400 bg-gray-100 rounded-r-2xl">
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
                <p className="text-sm text-gray-700 mt-2 ">
                  {comment.children.title}
                </p>
                <button className="text-xs text-gray-500"> Reply</button>
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default Comments;
