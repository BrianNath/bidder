import fetchApi from "@/utils/fetchApi";
import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import Breadcrumb from "@/components/Breadcrumb";
import ItemCard from "@/components/ItemCard";

function Home() {
  const [auctionList, setAuctionList] = useState([]);
  // const [offset, setOffset] = useState(5);
  // const userData = JSON.parse(localStorage.userData);

  async function getAuctionsLazy() {
    const payload = {
      url: "/api/auction/get-auctions-lazy/0.20",
      method: "GET",
    };
    
    const fetch = await fetchApi(payload);

    if (fetch.isOk) {
      console.log("FETCH : ", fetch.record.items);
      const filteredList = fetch.record.items.map((v) => {
        return filterAuction(v);
      });
      setAuctionList(filteredList);
    }
  }

  function filterAuction(auctionData) {
    // console.log("AUCTION DATA:", auctionData);
    const id = auctionData.id;
    const creatorName = auctionData.expand.bidderId.name;
    const category = auctionData.expand.categoryId.map((v) => v.categoryName);
    const title = auctionData.expand.itemId.title;
    const openPrice = auctionData.openPrice;
    const timeStart = auctionData.timeStart;

    const filteredAuctionData = {
      creatorName,
      category,
      title,
      openPrice,
      timeStart,
      id,
    };

    return filteredAuctionData;
  }

  useEffect(() => {
    // findSelfUserById();
    getAuctionsLazy();
  }, []);

  // useEffect(() => {
  //   console.log("auctionList : ", auctionList);
  // }, [auctionList]);

  return (
    <>
      <TopBar />

      <main className="w-8/12 m-auto">
        <div className="m-5">
          <Breadcrumb />
        </div>

        <div className="my-2 flex gap-4">
          <button className="btn" onClick={getAuctionsLazy}>
            Get Auction Lazy
          </button>
        </div>

        <div className="mt-2 flex gap-6">
          {/* <ItemCard
            category="HELLO"
            creatorName="HELLO"
            title="HELLO"
            timeStart="HELLO"
            openPrice="HELLO"
          /> */}
          {auctionList.map((auction, index) => {
            return (
              <ItemCard
                key={index}
                id={auction.id}
                category={auction.category}
                creatorName={auction.creatorName}
                title={auction.title}
                timeStart={auction.timeStart}
                openPrice={auction.openPrice}
              />
            );
          })}
        </div>
      </main>
    </>
  );
}

export default Home;
