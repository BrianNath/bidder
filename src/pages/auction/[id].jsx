import { useRouter } from "next/router";
import fetchApi from "@/utils/fetchApi";
import { useState, useEffect } from "react";
import getUserAvatar from "@/utils/getUserAvatar";
import { formatIDR } from "@/utils/numbering";
import { timeAgo } from "@/utils/date";
import ImagePopup from "@/components/ImagePopup";
import OffersDialog from "@/components/OffersDialog";
import executeAtTime from "@/utils/executeAtTime";

export default function AuctionDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [creatorAvatar, setCreatorAvatar] = useState("");
  const [winnerAvatar, setWinnerAvatar] = useState("");
  const [auctionDetails, setAuctionDetails] = useState({});
  const [winnerAuction, setWinnerAuction] = useState({});
  const [offersList, setOffersList] = useState([]);
  const [onLoading, setOnLoading] = useState(true);
  const [imgUrl, setImgUrl] = useState("");
  const [offersDialogOpen, setOffersDialogOpen] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [userData, setUserData] = useState({});
  const [offerBid, setOfferBid] = useState(0);
  const [auctionData, setAuctionData] = useState({});

  async function getImageURL() {
    const options = { thumb: "150x300" };
    const payload = {
      url: `/api/items/get-item-img-url-by-auction-id/${id}?options=${JSON.stringify(
        options
      )}`,
      method: "GET",
    };
    const fetch = await fetchApi(payload);
    if (fetch.isOk) {
      setImgUrl(fetch.url);
    }
  }

  async function getDetailsById() {
    const payload = {
      url: `/api/auctions/${id}`,
      method: "GET",
    };
    const fetch = await fetchApi(payload);
    // console.log("FETCH:", fetch);
    setAuctionData(fetch.record);
    if (fetch.isOk) {
      const dataNeeded = neededDetailsData(fetch.record);
      setAuctionDetails(dataNeeded);
      setCreatorAvatar(getUserAvatar(dataNeeded.creatorName));
      getOffersByAuctionId();
      getImageURL();
    }
    setOnLoading(false);
  }

  function handleBidOffer(event) {
    !event.target.value ? (event.target.value = "0") : null;
    const rawValue = event.target.value.replace(/[^\d]/g, "");
    const formattedValue = parseInt(rawValue).toLocaleString();
    setOfferBid(formattedValue);
  }

  async function getOffersByAuctionId() {
    const payload = {
      url: `/api/auctions/get-offers-by-auction-id/${id}`,
      method: "GET",
    };
    const fetch = await fetchApi(payload);
    if (fetch.isOk) {
      const neededData = fetch.record.map((offer) => neededOffersData(offer));
      // console.log("NEEDED OFFERS DATA = ", neededData);
      setOffersList(neededData);
      setWinnerAuction(neededData[0]);
      const winnerName = neededData[0]?.name;
      setWinnerAvatar(getUserAvatar(winnerName ? winnerName : ""));

      //   if (auctionDetails.status == "Waiting") {
      //     startAuction();
      //   }

      //   if (auctionDetails.status == "Ongoing") {
      //     closeAuction();
      //   }
    }
  }

  function neededOffersData(offersRecord) {
    // console.log("OFFERS RECORD = ", offersRecord);
    const name = offersRecord.expand.bidderId.name;
    const priceOffered = offersRecord.priceOffered;
    const offeredTime = Date.parse(offersRecord.created);
    const isWin = offersRecord.isWin;

    return {
      isWin,
      name,
      priceOffered,
      offeredTime,
    };
  }

  function neededDetailsData(detailsRecord) {
    const title = detailsRecord.expand.itemId.title;
    const itemName = detailsRecord.expand.itemId.itemName;
    const itemPicture = detailsRecord.expand.itemId.itemPicture;
    const condition = detailsRecord.expand.itemId.condition;
    const quantity = detailsRecord.expand.itemId.quantity;
    const description = detailsRecord.expand.itemId.description;
    const categoryName =
      detailsRecord.expand.itemId.expand.categoryId.categoryName;
    const creatorName = detailsRecord.expand.creatorId.name;
    const openPrice = detailsRecord.expand.itemId.openPrice;
    const timeEnd = Date.parse(detailsRecord.timeEnd);
    const timeStart = Date.parse(detailsRecord.timeStart);
    const createdAt = Date.parse(detailsRecord.timeStart);
    const status = detailsRecord.status;
    const id = detailsRecord.id;

    return {
      timeEnd,
      timeStart,
      id,
      description,
      status,
      title,
      itemName,
      itemPicture,
      condition,
      quantity,
      categoryName,
      creatorName,
      createdAt,
      openPrice,
    };
  }

  async function bidOffer() {
    const parsedOfferBid = parseInt(offerBid.replace(/\./g, ""));

    if (auctionDetails.status != "Ongoing") {
      return;
    }

    if (parsedOfferBid < auctionDetails.openPrice) {
      return;
    }

    const body = {
      bidderId: userData.id,
      auctionId: id,
      priceOffered: parsedOfferBid,
      isWin: false,
    };

    const payload = {
      url: `/api/offers/add`,
      method: "POST",
      body,
    };

    const fetch = await fetchApi(payload);

    if (fetch.isOk) {
      getOffersByAuctionId();
    }
    setOfferBid(0);
  }

  function openDialogOngoing() {}
  function openDialogDone() {}

  // async function startAuction() {
  //   const body = {
  //     id: auctionDetails.id,
  //     data: {
  //       status: "Ongoing",
  //     },
  //   };

  //   const payload = {
  //     url: `/api/auctions/update`,
  //     method: "POST",
  //     body,
  //   };

  //   const fetch = await fetchApi(payload);

  //   if (fetch.isOk) {
  //     getDetailsById();
  //   }
  // }

  // async function closeAuction() {
  //   const body = {
  //     id: auctionDetails.id,
  //     data: {
  //       status: "Done",
  //     },
  //   };

  //   const payload = {
  //     url: `/api/auctions/update`,
  //     method: "POST",
  //     body,
  //   };

  //   const fetch = await fetchApi(payload);

  //   if (fetch.isOk) {
  //     getDetailsById();
  //   }
  // }

  useEffect(() => {
    if (!localStorage.userData) {
      return;
    } else {
      setUserData(JSON.parse(localStorage.userData));
    }

    if (id) {
      getDetailsById();
    }
  }, [id]);

  if (onLoading) return <DetailsSkeleton />;

  return (
    <>
      <div className="flex">
        <ImagePopup
          imageUrl={imgUrl}
          onClose={() => setOpenPopUp(false)}
          isOpen={openPopUp}
        />
        <div className="w-full">
          <img
            onClick={() => setOpenPopUp(true)}
            src={imgUrl}
            alt=""
            className="w-80 cursor-pointer h-80 object-cover rounded-lg"
          />
          <div className="flex items-center space-x-4 mt-4">
            {creatorAvatar ? (
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                  <span className="text-xs">{creatorAvatar}</span>
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                  <span className="text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            )}
            <div className="font-medium">
              <div>{auctionDetails.creatorName}</div>
              <div className="text-sm text-gray-500">
                Dilelang {timeAgo(auctionDetails.createdAt)}
              </div>
            </div>
          </div>
        </div>
        <div className="ml-10 w-full">
          <h1 className="text-2xl font-bold">{auctionDetails.title}</h1>
          <div className="mt-2 text-lg">
            <div className="mt-2">
              <span className="font-medium mr-2 text-gray-400">Kategori:</span>
              <span className="font-semibold text-gray-500 hover:text-gray-700 cursor-pointer">
                {auctionDetails.categoryName}
              </span>
            </div>
            <div className="mt-2">
              <span className="font-medium mr-2 text-gray-400">Kuantitas:</span>
              <span className="font-semibold">{auctionDetails.quantity}</span>
            </div>
            <div className="mt-2">
              <span className="font-medium mr-2 text-gray-400">Merk:</span>
              <span className="font-semibold text-gray-500 hover:text-gray-700 cursor-pointer">
                {auctionDetails.itemName}
              </span>
            </div>
            <div className="mt-2">
              <span className="font-medium mr-2 text-gray-400">Kondisi:</span>
              <div
                className="tooltip tooltip-right"
                data-tip={`${auctionDetails.condition}/100`}
              >
                <progress
                  className="progress progress-success w-72"
                  value={auctionDetails.condition}
                  max="100"
                ></progress>
              </div>
            </div>
            <div className="mt-2">
              <span className="font-medium mr-2 text-gray-400">
                Harga Pembuka:
              </span>
              <span className="font-semibold">
                {formatIDR(auctionDetails.openPrice)}
              </span>
            </div>
            <div className="mt-2">
              <p className="font-medium mr-2 text-gray-400">Deskripsi:</p>
              <div
                className=""
                dangerouslySetInnerHTML={{ __html: auctionDetails.description }}
              />
            </div>
          </div>
        </div>
        <div className="ml-10 w-10/12">
          <div className="flex gap-2">
            <DetailsStatus
              status={auctionDetails.status}
              timeEnd={auctionDetails.timeEnd}
            />

            {auctionDetails.status == "Waiting" &&
            userData.expand.roleId.roleName == "officer" ? (
              <button
                onClick={openDialogOngoing}
                className="p-4 cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700 text-white h-full font-bold"
              >
                Buka
              </button>
            ) : null}

            {auctionDetails.status == "Ongoing" &&
            userData.expand.roleId.roleName == "officer" ? (
              <button
                onClick={openDialogDone}
                className="p-4 cursor-pointer text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white min-h-full font-bold"
              >
                Selesai
              </button>
            ) : null}
          </div>
          <div className="border border-gray-300 mt-4 rounded-lg p-5 shadow-lg">
            {auctionDetails.status == "Done" ? (
              <h2 className="text-lg font-bold">Pemenang &#128512;</h2>
            ) : (
              <h2 className="text-lg font-bold">Pemenang Sementara</h2>
            )}
            {winnerAuction ? (
              <div>
                <div className="mt-4">
                  <div className="flex items-center space-x-4 mt-4">
                    {winnerAvatar ? (
                      <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                          <span className="text-xs">{winnerAvatar}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                          <span className="text-xs">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="font-medium">
                      <div>{winnerAuction.name}</div>
                      <div className="text-sm text-gray-500">
                        Ditawar {timeAgo(winnerAuction.offeredTime)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-4">
                  <label className="mr-2 text-gray-500 font-medium">
                    Tawaran Terakhir :
                  </label>
                  <span className="font-bold relative w-full">
                    <span className="absolute w-80">
                      {formatIDR(winnerAuction.priceOffered)}
                    </span>
                  </span>
                </div>
                <span
                  onClick={() => setOffersDialogOpen(true)}
                  className="hover:underline cursor-pointer text-sm font-medium text-gray-400"
                >
                  Lihat Semua Tawaran
                </span>
                {auctionDetails.status == "Ongoing" &&
                userData.expand.roleId.roleName == "buyer" ? (
                  <div className="mt-4 border p-3 rounded">
                    <div className="w-full">
                      <label
                        htmlFor="openPrice"
                        className="block mb-2 font-medium text-gray-900"
                      >
                        Ajukan Penawaran
                        <span className="ml-2 text-xs text-gray-400">
                          Rupiah
                        </span>
                      </label>
                      <div className="flex gap-2 h-10 items-center">
                        <input
                          id="offerBid"
                          name="offerBid"
                          type="text"
                          onChange={handleBidOffer}
                          value={offerBid}
                          autoComplete="offerBid"
                          placeholder="Harga Awal"
                          required
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        />
                        <button className="btn" onClick={bidOffer}>
                          Ajukan
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
                <OffersDialog
                  list={offersList}
                  isOpen={offersDialogOpen}
                  closeStateFunction={() => setOffersDialogOpen(false)}
                />
              </div>
            ) : (
              <div className="text-gray-400">(Belum Ada)</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function DetailsSkeleton() {
  return <>Loading</>;
}

function DetailsStatus({ status, timeEnd }) {
  if (status == "Ongoing") {
    return (
      <div className="bg-blue-600 hover:bg-blue-700 w-full rounded-lg uppercase p-4 text-white font-bold">
        Sedang Berlangsung
      </div>
    );
  } else if (status == "Done") {
    return (
      <div className="bg-green-600 hover:bg-green-700 w-full rounded-lg uppercase p-4 text-white font-bold">
        Selesai {timeAgo(timeEnd)}
      </div>
    );
  } else if (status == "Canceled") {
    return (
      <div className="bg-red-600 hover:bg-red-700 w-full rounded-lg uppercase p-4 text-white font-bold">
        Dibatalkan
      </div>
    );
  } else if (status == "Waiting") {
    return (
      <div className="bg-yellow-600 hover:bg-yellow-700 w-full rounded-lg uppercase p-4 text-white font-bold">
        Menunggu
      </div>
    );
  } else {
    return (
      <div className="bg-gray-600 hover:bg-gray-700 w-full rounded-lg uppercase p-4 text-white font-bold">
        {status}
      </div>
    );
  }
}
