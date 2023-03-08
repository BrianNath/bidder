import fetchApi from "@/utils/fetchApi";
import { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import CardAuctionSkeleton from "@/components/CardAuctionSkeleton";

function Auction() {
  const [auctionList, setAuctionList] = useState([]);
  const [auctionListLoading, setAuctionListLoading] = useState(true);
  // const [offset, setOffset] = useState(5);
  // const userData = JSON.parse(localStorage.userData);

  async function getAuctionsLazy() {
    setAuctionListLoading(true);
    const payload = {
      url: "/api/auction/get-auctions-lazy/0.20",
      method: "GET",
    };
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
    const category = auctionData.expand.categoryId.categoryName;
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

  useEffect(() => {
    getAuctionsLazy();
  }, []);

  return (
    <>
      <div className="flex gap-6">
        {auctionListLoading ? (
          <div className="mt-3 justify-evenly w-full flex">
            <CardAuctionSkeleton />
            <CardAuctionSkeleton />
            <CardAuctionSkeleton />
            <CardAuctionSkeleton />
          </div>
        ) : (
          auctionList.map((auction, index) => {
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
          })
        )}
      </div>
    </>
  );
}

export default Auction;
