import fetchApi from "@/utils/fetchApi";
import { useEffect, useState } from "react";
import TableSkeleton from "@/components/TableSkeleton";
import { formatIDR } from "@/utils/numbering";
import { timestampToUI } from "@/utils/date";
import { useRouter } from "next/router";

function Item() {
  const router = useRouter();
  const [auctionList, setAuctionList] = useState([]);
  const [imageList, setImageList] = useState({});
  const [auctionListLoading, setAuctionListLoading] = useState(true);

  async function getAuctionsLazy() {
    setAuctionListLoading(true);
    const payload = {
      url: "/api/auctions/get-auctions-lazy/0.20",
      method: "GET",
    };
    const fetch = await fetchApi(payload);

    if (fetch.isOk) {
      const filteredAuctionList = await Promise.all(
        fetch.record.items.map(async (auction) => {
          const creatorName = auction.expand.creatorId.name;
          const category = auction.expand.itemId.expand.categoryId.categoryName;
          const title = auction.expand.itemId.title;
          const openPrice = auction.openPrice;
          const id = auction.id;
          const status = auction.status;
          const quantity = auction.expand.itemId.quantity;
          const itemName = auction.expand.itemId.itemName;
          const condition = auction.expand.itemId.condition;
          const created = auction.expand.itemId.created;
          const imgUrl = await getImageURL(id);

          return {
            status,
            id,
            title,
            itemName,
            creatorName,
            category,
            openPrice,
            quantity,
            condition,
            created,
            imgUrl,
          };
        })
      );
      setAuctionList(filteredAuctionList);
    }
    setAuctionListLoading(false);
  }

  async function getImageURL(id) {
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
      return fetch.url;
    } else {
      return "/no-image.png";
    }
  }

  useEffect(() => {
    getAuctionsLazy();
  }, []);

  return (
    <>
      <div className="flex gap-6">
        {auctionListLoading ? (
          <>Loading</>
        ) : (
          <>
            <div className="rounded-lg shadow p-5 w-full bg-white">
              <h1 className="text-2xl font-semibold text-gray-500 mb-4">
                Daftar Barang
              </h1>
              <div className="overflow-x-auto w-full max-w-6xl">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Gambar Produk</th>
                      <th>Judul</th>
                      <th>Nama Produk</th>
                      <th>Status</th>
                      <th>Dibuat Oleh</th>
                      <th>Kategori</th>
                      <th>Harga Pembuka</th>
                      <th>Jumlah Barang</th>
                      <th>Kondisi</th>
                      <th>Tanggal Dibuat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auctionList.map((auction) => {
                      return (
                        <tr
                          className="text-gray-500 font-medium"
                          key={auction.id}
                        >
                          <td>
                            <button
                              className="w-12 flex justify-center hover:text-blue-500"
                              onClick={() => {
                                router.push(`/auction/${auction.id}`);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                />
                              </svg>
                            </button>
                          </td>
                          <td>
                            <div class="avatar">
                              <div class="w-24 rounded">
                                <img src={auction.imgUrl} alt={auction.title} />
                              </div>
                            </div>
                          </td>
                          <td>{auction.title}</td>
                          <td>{auction.itemName}</td>
                          <td>{auction.status}</td>
                          <td>{auction.creatorName}</td>
                          <td>{auction.category}</td>
                          <td>{formatIDR(auction.openPrice || "0")}</td>
                          <td>{auction.quantity}</td>
                          <td>{auction.condition}/100</td>
                          <td>{timestampToUI(auction.created)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>

          // auctionList.map((auction, index) => {
          //   return <>{"ITEM"}</>;
          // })
        )}
      </div>
    </>
  );
}

export default Item;
