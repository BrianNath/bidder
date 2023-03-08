import React, { useEffect, useState } from "react";
import { formatIDR } from "@/utils/numbering";
import { useRouter } from "next/router";
import fetchApi from "@/utils/fetchApi";

function ItemCard({
  creatorName,
  category,
  title,
  openPrice,
  timeStart,
  id,
  status,
}) {
  // console.log("PROPS:", { creatorName, category, title, openPrice, timeStart, id });
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("/no-image.png");
  const [redirectLoading, setRedirectLoading] = useState(false);

  async function getImageURL() {
    const options = { thumb: "150x300" };
    const payload = {
      url: `/api/item/get-item-img-url-by-auction-id/${id}?options=${JSON.stringify(
        options
      )}`,
      method: "GET",
    };
    const fetch = await fetchApi(payload);
    console.log("FETCH:", fetch);
    if (fetch.isOk) {
      setImageUrl(fetch.url);
    }
  }

  function handleClick() {
    setRedirectLoading(true);
    router.push(`/auction/${id}`);
  }

  useEffect(() => {
    getImageURL();
  }, [imageUrl]);

  return (
    <div className="w-56 rounded-lg drop-shadow-md bg-white">
      <img
        onClick={handleClick}
        src={imageUrl}
        alt=""
        className="object-cover rounded-t-lg cursor-pointer h-48 w-56"
      />
      <div className="px-3 py-2">
        <p className="truncate overflow-hidden max-h-24 leading-6">
          {title ? title : "(Empty)"}
        </p>
        <p className="font-bold mt-1 truncate overflow-hidden max-h-24 leading-6">
          Start Bid: {openPrice >= 0 ? formatIDR(openPrice) : "-"}
        </p>
        <div className="flex items-center mt-1 font-medium text-sm">
          <button className="text-gray-500 hover:text-gray-800 cursor-pointer">
            {creatorName ? creatorName : "(Unknown)"}
          </button>
        </div>
        <button
          onClick={handleClick}
          className={`my-3 btn rounded-full w-full btn-outline ${
            redirectLoading ? "loading" : ""
          }`}
        >
          See Item
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status == "Ongoing") {
    return (
      <div className="bg-blue-600 text-center hover:bg-blue-700 rounded-full px-3 font-medium text-white text-sm py-2">
        Sedang Berlangsung
      </div>
    );
  } else if (status == "Done") {
    return (
      <div className="bg-green-600 text-center hover:bg-green-700 rounded-full px-3 font-medium text-white text-sm py-2">
        Selesai
      </div>
    );
  } else if (status == "Canceled") {
    return (
      <div className="bg-red-600 text-center hover:bg-red-700 rounded-full px-3 font-medium text-white text-sm py-2">
        Dibatalkan
      </div>
    );
  } else if (status == "Waiting") {
    return (
      <div className="bg-yellow-600 text-center hover:bg-yellow-700 rounded-full px-3 font-medium text-white text-sm py-2">
        Menunggu
      </div>
    );
  } else {
    return (
      <div className="bg-gray-600 text-center hover:bg-gray-700 rounded-full px-3 font-medium text-white text-sm py-2">
        {status}
      </div>
    );
  }
}

export default ItemCard;
