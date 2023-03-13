import fetchApi from "@/utils/fetchApi";
import { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import CardAuctionSkeleton from "@/components/CardAuctionSkeleton";

function Auction() {
  const [auctionList, setAuctionList] = useState([]);
  const [auctionListLoading, setAuctionListLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");

  async function getAuctionsLazy(status = "") {
    setAuctionListLoading(true);
    console.log("SELECTED STATUS:", status);
    setSelectedStatus(status);
    let payload = {
      url: `/api/auctions/get-auctions-lazy/0.20`,
      method: "GET",
    };

    if (status) {
      payload = {
        url: `/api/auctions/get-auctions-lazy/0.20?status=${status}`,
        method: "GET",
      };
    }

    const fetch = await fetchApi(payload);

    if (fetch.isOk) {
      // console.log("FETCH : ", fetch.record.items);
      const filteredList = fetch.record.items.map((v) => {
        return filterAuction(v);
      });
      // return filteredList;
      setAuctionList(filteredList);
    }
    setAuctionListLoading(false);
  }

  function filterAuction(auctionData) {
    const creatorName = auctionData.expand.creatorId.name;
    const category = auctionData.expand.itemId.expand.categoryId.categoryName;
    const title = auctionData.expand.itemId.title;
    const openPrice = auctionData.expand.itemId.openPrice;
    const timeStart = auctionData.timeStart;
    const status = auctionData.status;
    const id = auctionData.id;

    const filteredAuctionData = {
      creatorName,
      category,
      title,
      openPrice,
      timeStart,
      id,
      status,
    };

    return filteredAuctionData;
  }

  async function handleStatusFilter(e) {
    // console.log(e.target.value);
    // e.preventDefault();
    // setSelectedStatus();
    await getAuctionsLazy(e.target.value);
  }

  useEffect(() => {
    getAuctionsLazy();
  }, []);

  return (
    <>
      {auctionListLoading ? (
        <>
          <div className="w-full p-5 my-5 bg-gray-300 rounded-md shadow-lg animate-pulse"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <CardAuctionSkeleton />
            <CardAuctionSkeleton />
            <CardAuctionSkeleton />
            <CardAuctionSkeleton />
            <CardAuctionSkeleton />
            <CardAuctionSkeleton />
            <CardAuctionSkeleton />
            <CardAuctionSkeleton />
            <CardAuctionSkeleton />
            <CardAuctionSkeleton />
          </div>
        </>
      ) : (
        <>
          <div className="flex mb-6">
            <div>
              <label className="font-medium text-gray-500">Status</label>
              <select
                onChange={(e) => getAuctionsLazy(e.target.value)}
                defaultValue={""}
                value={selectedStatus}
                className="select mt-1 select-bordered w-full max-w-xs"
              >
                <option value={""}>Semua</option>
                <option value={"Waiting"}>Menunggu</option>
                <option value={"Ongoing"}>Sedang Berlangsung</option>
                <option value={"Done"}>Selesai</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 mb-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {auctionList.map((auction, index) => {
              return (
                <ItemCard
                  key={index}
                  category={auction.category}
                  creatorName={auction.creatorName}
                  title={auction.title}
                  timeStart={auction.timeStart}
                  openPrice={auction.openPrice}
                  id={auction.id}
                  status={auction.status}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export default Auction;
