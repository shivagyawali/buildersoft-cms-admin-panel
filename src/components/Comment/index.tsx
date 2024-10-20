import Image from "next/image";
import React from "react";
import userProfile from "@app/assets/images/avatar.png";
import InputField from "../forms/InputField";
import { FgSendIcon } from "@app/constants/SVGCollection";
import Comments from "./Comments";

const Comment = () => {
  return (
    <div className="w-2/3 bg-white rounded-2xl p-5">
      {/* Comments will be up here */}
      <div className="mb-6">
      <Comments />
      </div>

      <div className="w-full flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={userProfile}
            alt="user-profile-picture"
            width={500}
            height={500}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <form className="relative w-full">
          <input
            name="comment"
            placeholder="Add comment"
            className="border border-[#DDDDDD] text-sm py-3 px-3 outline-none rounded-full w-full"
          />
          <button
            type="submit"
            className="absolute right-1 top-[3px] stroke-white bg-blue-500 p-2 rounded-full"
          >
            <FgSendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Comment;
