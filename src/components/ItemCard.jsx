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
      url: `/api/items/get-item-img-url-by-auction-id/${id}?options=${JSON.stringify(
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
    <div className="w-full rounded-lg drop-shadow-md bg-white relative">
      <StatusBadge status={status} />
      {/* <span className="text-sm font-medium rounded-full py-1 px-2 bg-red-500 absolute right-2 top-2 text-white">
        Sedang Berlangsung
      </span> */}
      <img
        onClick={handleClick}
        src={imageUrl}
        alt=""
        className="object-cover rounded-t-lg cursor-pointer h-48 w-full"
      />
      <div className="px-3 py-2">
        <StatusBadge status={status} />
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
      <div className="bg-blue-200 text-blue-700 text-sm font-bold rounded-full py-1 px-2 absolute right-2 top-2">
        Sedang Berlangsung
      </div>
    );
  } else if (status == "Done") {
    return (
      <div className="bg-green-200 text-green-700 text-sm font-bold rounded-full py-1 px-2 absolute right-2 top-2">
        Selesai
      </div>
    );
  } else if (status == "Canceled") {
    return (
      <div className="bg-red-200 text-red-700 text-sm font-bold rounded-full py-1 px-2 absolute right-2 top-2">
        Dibatalkan
      </div>
    );
  } else if (status == "Waiting") {
    return (
      <div className="bg-yellow-200 text-yellow-700 text-sm font-bold rounded-full py-1 px-2 absolute right-2 top-2">
        Menunggu
      </div>
    );
  } else {
    return (
      <div className="bg-gray-200 text-gray-700 text-sm font-bold rounded-full py-1 px-2 absolute right-2 top-2">
        {status}
      </div>
    );
  }
}

export default ItemCard;
