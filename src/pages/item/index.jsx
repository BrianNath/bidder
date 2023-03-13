import fetchApi from "@/utils/fetchApi";
import { useEffect, useState } from "react";
import { formatIDR } from "@/utils/numbering";
import { timestampToUI } from "@/utils/date";
import { useRouter } from "next/router";
import ProtectedRoute from "@/lib/ProtectedRoute";
import DialogItem from "@/components/DialogItem";
import ExportExcel from "@/components/ExportExcel";

function Item() {
  const router = useRouter();
  const [auctionList, setAuctionList] = useState([]);
  const [dataToExport, setDataToExport] = useState([]);
  const [imageList, setImageList] = useState({});
  const [auctionListLoading, setAuctionListLoading] = useState(true);
  const [selectedItemData, setSelectedItemData] = useState({});
  const [openDialogItem, setOpenDialogItem] = useState(false);

  function generatePDF() {}

  function handleOpenDialog(itemData) {
    console.log("ITEM DATA = ", itemData);
    setSelectedItemData(itemData);
    setOpenDialogItem(true);
  }

  async function getAuctionsLazy() {
    setAuctionListLoading(true);
    const payload = {
      url: "/api/auctions/get-auctions-lazy/0.20",
      method: "GET",
    };
    const fetch = await fetchApi(payload);

    if (fetch.isOk) {
      const dataForExportExcel = fetch.record.items.map((auction) => {
        const title = auction.expand.itemId.title;
        const creatorName = auction.expand.creatorId.name;
        const category = auction.expand.itemId.expand.categoryId.categoryName;
        const openPrice = formatIDR(auction.expand.itemId.openPrice);
        const itemName = auction.expand.itemId.itemName;
        const condition = `${auction.expand.itemId.condition}/100`;
        const created = timestampToUI(auction.expand.itemId.created);
        const status = auction.status;

        return {
          title,
          creatorName,
          status,
          category,
          openPrice,
          itemName,
          condition,
          created,
        };
      });
      
      const filteredAuctionList = await Promise.all(
        fetch.record.items.map(async (auction) => {
          const creatorName = auction.expand.creatorId.name;
          const category = auction.expand.itemId.expand.categoryId.categoryName;
          const categoryId = auction.expand.itemId.expand.categoryId.id;
          const title = auction.expand.itemId.title;
          const openPrice = auction.expand.itemId.openPrice;
          const itemId = auction.expand.itemId.id;
          const id = auction.id;
          const status = auction.status;
          const quantity = auction.expand.itemId.quantity;
          const description = auction.expand.itemId.description;
          const itemName = auction.expand.itemId.itemName;
          const condition = auction.expand.itemId.condition;
          const created = auction.expand.itemId.created;
          const imgUrl = await getImageURL(id);

          return {
            itemId,
            categoryId,
            description,
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
      setDataToExport(dataForExportExcel);
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
    // console.log("FETCH:", fetch);
    if (fetch.isOk) {
      return fetch.url;
    } else {
      return "/no-image.png";
    }
  }

  function handleCloseDialogItem() {
    getAuctionsLazy();
    setOpenDialogItem(false);
  }

  useEffect(() => {
    getAuctionsLazy();
  }, []);

  return (
    <ProtectedRoute requiredRole="viewItems">
      <div className="flex gap-6">
        {auctionListLoading ? (
          <div>Loading</div>
        ) : (
          <>
            <div className="rounded-lg shadow p-5 w-full bg-white">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-500 mb-4 block">
                  Daftar Barang
                </h1>
                <ExportExcel data={dataToExport} fileName="auction-data" />
              </div>
              <DialogItem
                isOpen={openDialogItem}
                closeStateFunction={handleCloseDialogItem}
                itemData={selectedItemData}
              />
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
                            {auction.status == "Waiting" ? (
                              <button
                                className="w-12 flex justify-center hover:text-blue-500"
                                onClick={() => handleOpenDialog(auction)}
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
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                  />
                                </svg>
                              </button>
                            ) : (
                              <button
                                className="w-12 flex justify-center hover:text-blue-500"
                                onClick={() =>
                                  router.push(`/auction/${auction.id}`)
                                }
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
                            )}
                          </td>
                          <td>
                            <div className="avatar">
                              <div className="w-24 rounded">
                                <img src={auction.imgUrl} alt={auction.title} />
                              </div>
                            </div>
                          </td>
                          <td>{auction.title}</td>
                          <td>{auction.itemName}</td>
                          <td>{statusBadge({ status: auction.status })}</td>
                          <td>{auction.creatorName}</td>
                          <td>{auction.category}</td>
                          <td>{formatIDR(auction.openPrice || "0")}</td>
                          <td className="text-center">{auction.quantity}</td>
                          <td>
                            {conditionStatus({ condition: auction.condition })}
                            /100
                          </td>
                          <td>{timestampToUI(auction.created)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}

function conditionStatus({ condition }) {
  if (condition > 70) {
    return <span className="text-green-500 font-medium">{condition}</span>;
  } else if (condition > 50) {
    return <span className="text-yellow-500 font-medium">{condition}</span>;
  } else if (condition > 0) {
    return <span className="text-red-500 font-medium">{condition}</span>;
  }
}

function statusBadge({ status }) {
  if (status == "Waiting") {
    return (
      <span className="px-2 py-1 text-sm rounded-full bg-yellow-200 text-yellow-700">
        {status}
      </span>
    );
  }

  if (status == "Ongoing") {
    return (
      <span className="px-2 py-1 text-sm rounded-full bg-blue-200 text-blue-700">
        {status}
      </span>
    );
  }

  if (status == "Done") {
    return (
      <span className="px-2 py-1 text-sm rounded-full bg-green-200 text-green-700">
        {status}
      </span>
    );
  }
}

export default Item;
