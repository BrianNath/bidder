import fetchApi from "@/utils/fetchApi";
import { useEffect, useState } from "react";
import TableSkeleton from "@/components/TableSkeleton";

function Item() {
  const [auctionList, setAuctionList] = useState([]);
  const [auctionListLoading, setAuctionListLoading] = useState(true);

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
    const openPrice = auctionData.openPrice;
    const timeStart = auctionData.timeStart;
    const id = auctionData.id;

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
    getAuctionsLazy();
  }, []);

  return (
    <>
      <div className="flex gap-6">
        <TableSkeleton
          columns={[
            "",
            "Category",
            "Item Name",
            "Open Price",
            "Close Price",
            "Winner",
            "Image",
            "Title",
            "Quantity",
            "Condition",
            "Creator Name",
            "Open At",
            "Close At",
            "Status",
          ]}
          rows={7}
        />

        {/* {auctionListLoading ? (
        ) : (
          auctionList.map((auction, index) => {
            return <>{"ITEM"}</>;
          })
        )} */}
      </div>
    </>
  );
}

export default Item;
