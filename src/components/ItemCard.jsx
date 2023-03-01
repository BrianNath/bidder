import React from "react";
import { formatIDR } from "@/utils/numbering";

function ItemCard({ creatorName, category, title, openPrice, timeStart }) {
  console.log("PROPS:", { creatorName, category, title, openPrice, timeStart });
  return (
    <div className="w-56 rounded-lg drop-shadow-md bg-white">
      <img
        src="/iphonex.jpg"
        alt=""
        className="object-cover rounded-t-lg cursor-pointer h-48"
      />
      <div className="px-3 py-2">
        <p className="line-clamp-2 max-h-16">{title ? title : "(Empty)"}</p>
        <p className="font-bold mt-1">
          Start Bid: {openPrice >= 0 ? formatIDR(openPrice) : "-"}
        </p>
        <div className="flex items-center mt-1 font-medium text-sm">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <span className="">:</span> */}
          <button className="text-gray-500 hover:text-gray-800 cursor-pointer">
            {creatorName ? creatorName : "(Unknown)"}
          </button>
        </div>
        <button className="my-3 btn rounded-full w-full btn-outline">
          See Item
        </button>
      </div>
    </div>
  );
}

export default ItemCard;
