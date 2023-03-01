import fetchApi from "@/utils/fetchApi";
import UnauthorizedModal from "@/components/UnauthorizedModal";
import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import Breadcrumb from "@/components/Breadcrumb";
import ItemCard from "@/components/ItemCard";

function Home() {
  const [openUnauthorizedModal, setOpenUnauthorizedModal] = useState(false);
  const [auctionList, setAuctionList] = useState([]);
  // const [offset, setOffset] = useState(5);
  // const userData = JSON.parse(localStorage.userData);

  function showDialog() {
    setOpenUnauthorizedModal(true);
  }

  async function findSelfUserById() {
    const payload = {
      url: "/api/users/find-self-user-by-id",
      method: "GET",
      body: {},
    };
    const fetch = await fetchApi(payload);
    // console.log("FETCH : ", fetch);

    if (fetch.status == 401) {
      return showDialog();
    } else {
      return localStorage.setItem("userData", JSON.stringify(fetch.record));
    }
  }

  async function getAuctionsLazy() {
    const payload = {
      url: "/api/auctions/get-auctions-lazy/0.20",
      method: "GET",
      body: {},
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
    };

    return filteredAuctionData;
  }

  useEffect(() => {
    findSelfUserById();
    getAuctionsLazy();
  }, []);

  useEffect(() => {
    console.log("auctionList : ", auctionList);
  }, [auctionList]);

  return (
    <>
      <TopBar />

      <main className="w-8/12 m-auto">
        <div className="m-5">
          <Breadcrumb />
        </div>

        <UnauthorizedModal isOpen={openUnauthorizedModal} />

        <div className="my-2 flex gap-4">
          <button className="btn" onClick={findSelfUserById}>
            find Self User By Id
          </button>

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
