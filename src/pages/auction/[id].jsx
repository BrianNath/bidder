import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import fetchApi from "@/utils/fetchApi";
import getUserAvatar from "@/utils/getUserAvatar";
import { formatIDR } from "@/utils/numbering";
import { timeAgo } from "@/utils/date";
import DetailsStatus from "@/components/DetailsStatus";
import ImagePopup from "@/components/ImagePopup";
import { motion, AnimatePresence } from "framer-motion";
// import WinnerCard from "@/components/WinnerCard";
import dynamic from "next/dynamic";

const WinnerCard = dynamic(() => import("@/components/WinnerCard"), {
  ssr: false,
});

export default function AuctionDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [offersList, setOffersList] = useState([]);
  const [auctionDetails, setAuctionDetails] = useState({});
  const [creatorAvatar, setCreatorAvatar] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [onLoading, setOnLoading] = useState(true);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [userData, setUserData] = useState({});
  const [dialogOngoing, setDialogOngoing] = useState(false);
  const [dialogDone, setDialogDone] = useState(false);
  const [winnerCandidates, setWinnerCandidates] = useState([]);

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
    if (fetch.isOk) {
      const dataNeeded = neededDetailsData(fetch.record);
      console.log("dataNeeded:", dataNeeded);
      setAuctionDetails(dataNeeded);
      setCreatorAvatar(getUserAvatar(dataNeeded.creatorName));
      getOffersByAuctionId();
      getImageURL();
    }
    setOnLoading(false);
  }

  async function getOffersByAuctionId() {
    const payload = {
      url: `/api/auctions/get-offers-by-auction-id/${id}`,
      method: "GET",
    };
    const fetch = await fetchApi(payload);
    if (fetch.isOk) {
      const neededData = fetch.record.map((offer) => neededOffersData(offer));
      setOffersList(neededData);

      console.log("winnerOfferDetails : ", auctionDetails.winnerOfferDetails);
      console.log("auctionDetails : ", auctionDetails);
    }
  }

  function neededOffersData(offersRecord) {
    const name = offersRecord.expand.bidderId.name;
    const priceOffered = offersRecord.priceOffered;
    const id = offersRecord.id;
    const offeredTime = Date.parse(offersRecord.created);

    return {
      id,
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
    const winnerOffer = detailsRecord.winnerOffer;
    const winnerOfferDetails = detailsRecord.expand.winnerOffer;

    return {
      winnerOfferDetails,
      winnerOffer,
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

  function openDialogOngoing() {
    setDialogOngoing(true);
  }

  function openDialogDone() {
    setDialogDone(true);
  }

  async function startAuction() {
    const now = new Date();
    const body = {
      id: auctionDetails.id,
      data: {
        status: "Ongoing",
        timeStart: now,
      },
    };

    const payload = {
      url: `/api/auctions/update`,
      method: "POST",
      body,
    };

    const fetch = await fetchApi(payload);

    if (fetch.isOk) {
      getDetailsById();
    }
  }

  async function closeAuction(winnerOffer, closePrice) {
    const now = new Date();
    const body = {
      id: auctionDetails.id,
      data: {
        status: "Done",
        timeEnd: now,
        winnerOffer,
        closePrice,
      },
    };

    // console.log("CLOSE AUCTION BODY:", body);

    const payload = {
      url: `/api/auctions/update`,
      method: "POST",
      body,
    };

    const fetch = await fetchApi(payload);

    if (fetch.isOk) {
      getDetailsById();
    }
  }

  useEffect(() => {
    // console.log("LOCAL STORAGE: ", localStorage.userData);
    if (!localStorage?.userData) {
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
      {auctionDetails.status == "Waiting" && (
        <h1 className="font-bold bg-gray-400 rounded p-2 w-full text-xl text-white text-center">
          PREVIEW
        </h1>
      )}
      <div className="flex mt-4">
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
                {auctionDetails.timeStart
                  ? `Dilelang ${timeAgo(auctionDetails.timeStart)}`
                  : "Belum Dilelang"}
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
                style={{}}
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
              <>
                <button
                  onClick={openDialogOngoing}
                  className="p-4 cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700 text-white h-full font-bold"
                >
                  Buka
                </button>
                <ActionAuctionDialog
                  handleOpenAuc={startAuction}
                  isOpen={dialogOngoing}
                  closeStateFunction={() => setDialogOngoing(false)}
                  status={auctionDetails.status}
                />
              </>
            ) : null}

            {auctionDetails.status == "Ongoing" &&
            userData.expand.roleId.roleName == "officer" ? (
              <>
                <button
                  onClick={openDialogDone}
                  className="p-4 cursor-pointer text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white min-h-full font-bold"
                >
                  Selesai
                </button>
                <ActionAuctionDialog
                  handleCloseAuc={closeAuction}
                  isOpen={dialogDone}
                  closeStateFunction={() => setDialogDone(false)}
                  status={auctionDetails.status}
                  winnerList={winnerCandidates}
                />
              </>
            ) : null}
          </div>
          <WinnerCard
            auctionDetails={auctionDetails}
            offerList={offersList}
            userData={userData}
            setWinnerCandidates={setWinnerCandidates}
          />
        </div>
      </div>
    </>
  );
}

function DetailsSkeleton() {
  return <>Loading</>;
}

function ActionAuctionDialog({
  isOpen,
  closeStateFunction,
  status,
  handleCloseAuc,
  handleOpenAuc,
  winnerList,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative bg-white mx-3 rounded-lg shadow-lg"
            initial={{ translateY: 100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full h-full md:h-auto">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                  onClick={closeStateFunction}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                {status == "Waiting" ? (
                  <div className="p-8 text-center">
                    <svg
                      aria-hidden="true"
                      className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Buka lelang untuk barang ini?
                    </h3>
                    <button
                      onClick={handleOpenAuc}
                      type="button"
                      className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                    >
                      Buka Lelang
                    </button>
                    <button
                      onClick={closeStateFunction}
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <h3 className="m-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Silahkan pilih pemenang lelang ini
                    </h3>
                    <div className="overflow-auto max-h-72 m-4">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Nama</th>
                            <th>Harga Ditawarkan</th>
                            <th>Waktu Penawaran</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {winnerList.map((offer, index) => {
                            return (
                              <tr key={offer.id}>
                                <td>{index + 1}</td>
                                <td>{offer.name}</td>
                                <td>{formatIDR(offer.priceOffered)}</td>
                                <td>{timeAgo(offer.offeredTime)}</td>
                                <td className="text-center">
                                  <button
                                    onClick={() => handleCloseAuc(offer.id)}
                                    className="p-2 rounded text-green-500 bg-green-100 hover:bg-green-200 hover:text-green-00"
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
                                        d="M4.5 12.75l6 6 9-13.5"
                                      />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <button
                      onClick={closeStateFunction}
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
