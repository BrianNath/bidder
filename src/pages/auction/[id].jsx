import { useRouter } from "next/router";
import fetchApi from "@/utils/fetchApi";
import { useState, useEffect } from "react";
import getUserAvatar from "@/utils/getUserAvatar";
import { formatIDR } from "@/utils/numbering";
import { timeAgo } from "@/utils/date";
import { motion, AnimatePresence } from "framer-motion";
import ImagePopup from "@/components/ImagePopup";

export default function AuctionDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [creatorAvatar, setCreatorAvatar] = useState("");
  const [winnerAvatar, setWinnerAvatar] = useState("");
  const [auctionDetails, setAuctionDetails] = useState({});
  const [winnerAuction, setWinnerAuction] = useState({});
  const [offersList, setOffersList] = useState([]);
  const [onLoading, setOnLoading] = useState(true);
  const [richText, setRichText] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [offersDialogOpen, setOffersDialogOpen] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);

  async function getImageURL() {
    const options = { thumb: "150x300" };
    const payload = {
      url: `/api/item/get-item-img-url-by-auction-id/${id}?options=${JSON.stringify(
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
      url: `/api/auction/${id}`,
      method: "GET",
    };
    const fetch = await fetchApi(payload);
    // console.log("FETCH:", fetch);
    if (fetch.isOk) {
      const dataNeeded = neededDetailsData(fetch.record);
      setAuctionDetails(dataNeeded);
      setCreatorAvatar(getUserAvatar(dataNeeded.creatorName));
      getOffersByAuctionId();
      getImageURL();
    }
    setOnLoading(false);
  }

  async function getOffersByAuctionId() {
    const payload = {
      url: `/api/auction/get-offers-by-auction-id/${id}`,
      method: "GET",
    };
    const fetch = await fetchApi(payload);
    if (fetch.isOk) {
      const neededData = fetch.record.map((offer) => neededOffersData(offer));
      console.log("NEEDED OFFERS DATA = ", neededData);
      setOffersList(neededData);
      setWinnerAuction(neededData[0]);
      const winnerName = neededData[0]?.name;
      setWinnerAvatar(getUserAvatar(winnerName ? winnerName : ""));
    }
  }

  function neededOffersData(offersRecord) {
    console.log("OFFERS RECORD = ", offersRecord);
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
    const categoryName = detailsRecord.expand.categoryId.categoryName;
    const creatorName = detailsRecord.expand.creatorId.name;
    const openPrice = detailsRecord.expand.itemId.openPrice;
    const createdAt = Date.parse(detailsRecord.timeStart);
    const status = detailsRecord.status;

    return {
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

  const handleRichTextChange = (html) => {
    setRichText(html);
  };

  useEffect(() => {
    if (id) {
      getDetailsById();
    }
  }, [id]);

  if (onLoading) return <DetailsSkeleton />;

  return (
    <>
      <div className="flex">
        <div className="w-full">
          <img
            onClick={() => setOpenPopUp(true)}
            src={imgUrl}
            alt=""
            className="w-80 cursor-pointer h-80 object-cover rounded-lg"
          />
          <ImagePopup
            imageUrl={imgUrl}
            onClose={() => setOpenPopUp(false)}
            isOpen={openPopUp}
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
          <DetailsStatus status={auctionDetails.status} />
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

function DetailsStatus({ status }) {
  if (status == "Ongoing") {
    return (
      <div className="bg-blue-600 hover:bg-blue-700 w-full rounded-lg uppercase p-4 text-white font-bold">
        Sedang Berlangsung
      </div>
    );
  } else if (status == "Done") {
    return (
      <div className="bg-green-600 hover:bg-green-700 w-full rounded-lg uppercase p-4 text-white font-bold">
        Selesai
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

function OffersDialog({ isOpen, closeStateFunction, list }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    console.log("LIST: ", list);
  }, [isOpen]);

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
                <div className="p-8 min-w-max text-right">
                  <div className="overflow-auto max-h-72 m-4">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Nama</th>
                          <th>Harga Ditawarkan</th>
                          <th>Waktu Penawaran</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((offer, index) => {
                          return (
                            <tr>
                              {offer.isWin ? (
                                <th className="flex items-center gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5 text-yellow-500"
                                  >
                                    <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
                                  </svg>
                                  {index + 1}
                                </th>
                              ) : (
                                <th className="text-center">{index + 1}</th>
                              )}
                              <td>{offer.name}</td>
                              <td>{formatIDR(offer.priceOffered)}</td>
                              <td>{timeAgo(offer.offeredTime)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <button
                    onClick={closeStateFunction}
                    type="button"
                    className="text-gray-500 mt-4 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
