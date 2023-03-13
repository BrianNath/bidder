import { useState, useEffect } from "react";
import OffersDialog from "@/components/OffersDialog";
import { reduceMultipleString } from "@/utils/reduceMultipleFunction";
import { timeAgo } from "@/utils/date";
import { formatIDR } from "@/utils/numbering";
import getUserAvatar from "@/utils/getUserAvatar";
import fetchApi from "@/utils/fetchApi";

export default function WinnerCard({ auctionDetails, userData, setWinnerCandidates }) {
  const [winnerOffer, setWinnerOffer] = useState({});
  const [winnerTemporaryAvatar, setWinnerTemporaryAvatar] = useState("");
  const [winnerAvatar, setWinnerAvatar] = useState("");
  const [offersDialogOpen, setOffersDialogOpen] = useState(false);
  const [offerWarning, setOfferWarning] = useState(false);
  const [winnerTemporary, setWinnerTemporary] = useState({});
  const [offerBid, setOfferBid] = useState(0);
  const [componentLoading, setComponentLoading] = useState(true);
  const [offerList, setOfferList] = useState([]);

  function init() {
    setComponentLoading(true);
    getOffersByAuctionId();
    setComponentLoading(false);
  }

  async function getOffersByAuctionId() {
    const payload = {
      url: `/api/auctions/get-offers-by-auction-id/${auctionDetails.id}`,
      method: "GET",
    };
    const fetch = await fetchApi(payload);
    if (fetch.isOk) {
      const neededData = fetch.record.map((offer) => neededOffersData(offer));
      setOfferList(neededData);

      console.log("winnerOfferDetails : ", auctionDetails.winnerOfferDetails);
      console.log("auctionDetails : ", auctionDetails);

      if (auctionDetails.status == "Done") {
        const winnerDataNeeded = winnerOfferNeeded(
          auctionDetails.winnerOfferDetails
        );
        setWinnerOffer(winnerDataNeeded);
        setWinnerAvatar(
          getUserAvatar(winnerDataNeeded.name ? winnerDataNeeded.name : "")
        );
        // console.log("WINNER OFFER", auctionDetails.winnerOfferDetails);
      } else if (auctionDetails.status == "Ongoing") {
        setWinnerTemporary(neededData[0]);
        const winnerTemporaryName = neededData[0]?.name;
        console.log("WINNER TEMPORARY", neededData);
        setWinnerTemporaryAvatar(
          getUserAvatar(winnerTemporaryName ? winnerTemporaryName : "")
        );
        setWinnerCandidates(reduceMultipleString(neededData));
      }
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

  function handleBidOffer(event) {
    !event.target.value ? (event.target.value = "0") : null;
    const rawValue = event.target.value.replace(/[^\d]/g, "");
    const formattedValue = parseInt(rawValue).toLocaleString();
    setOfferBid(formattedValue);
  }

  async function bidOffer() {
    const parsedOfferBid = parseInt(
      offerBid ? offerBid.replace(/\./g, "") : "0"
    );

    if (auctionDetails.status != "Ongoing") {
      return;
    }

    if (parsedOfferBid < auctionDetails.openPrice) {
      setOfferWarning(true);
      return;
    }

    const body = {
      bidderId: userData.id,
      auctionId: auctionDetails.id,
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

  function winnerOfferNeeded(offerWinner) {
    // console.log("OFFER WINNER ", offerWinner);
    const id = offerWinner.id;
    const priceOffered = offerWinner.priceOffered;
    const offeredTime = Date.parse(offerWinner.created);
    const name = offerWinner.expand.bidderId.name;

    return { id, priceOffered, offeredTime, name };
  }

  const handleKeyDownOffer = (event) => {
    if (event.key === "Enter") {
      bidOffer();
    }
  };

  useEffect(() => {
    init();
  }, [auctionDetails]);

  if (componentLoading)
    return (
      <div className="border border-gray-200 bg-gray-400 mt-4 rounded-md shadow-lg animate-pulse w-full h-64"></div>
    );

  if (auctionDetails.status == "Ongoing") {
    return (
      <div className="border border-gray-300 mt-4 rounded-lg p-5 shadow-lg">
        <h2 className="text-lg font-bold">Pemenang</h2>
        {winnerTemporary?.name ? (
          <div>
            <div className="mt-4">
              <div className="flex items-center space-x-4 mt-4">
                {winnerTemporaryAvatar ? (
                  <div className="avatar placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                      <span className="text-xs">{winnerTemporaryAvatar}</span>
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
                  <div>{winnerTemporary.name}</div>
                  <div className="text-sm text-gray-500">
                    Ditawar {timeAgo(winnerTemporary.offeredTime)}
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
                  {formatIDR(winnerTemporary.priceOffered || "0")}
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
              list={offerList}
              isOpen={offersDialogOpen}
              closeStateFunction={() => setOffersDialogOpen(false)}
            />
          </div>
        ) : (
          <div className="text-gray-400">(Belum Ada)</div>
        )}
        {userData.expand.roleId.roleName == "buyer" ? (
          <div className="mt-4 border p-3 rounded">
            <div className="w-full">
              <label
                htmlFor="openPrice"
                className="block mb-2 font-medium text-gray-900"
              >
                Ajukan Penawaran
                <span className="ml-2 text-xs text-gray-400">Rupiah</span>
              </label>
              <div className="flex gap-2 h-10 items-center">
                <input
                  id="offerBid"
                  name="offerBid"
                  type="text"
                  onChange={handleBidOffer}
                  onKeyDown={handleKeyDownOffer}
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
              {offerWarning && (
                <small className="text-red-500">
                  Harga harus melebihi harga pembuka
                </small>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (auctionDetails.status == "Done") {
    return (
      <div className="border border-gray-300 mt-4 rounded-lg p-5 shadow-lg">
        <h2 className="text-lg font-bold">Pemenang Lelang</h2>
        <>
          {winnerOffer?.name ? (
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
                    <div>{winnerOffer.name}</div>
                    <div className="text-sm text-gray-500">
                      Ditawar {timeAgo(winnerOffer.offeredTime)}
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
                    {formatIDR(winnerOffer.priceOffered || "0")}
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
                list={offerList}
                isOpen={offersDialogOpen}
                closeStateFunction={() => setOffersDialogOpen(false)}
              />
            </div>
          ) : (
            <div className="text-gray-400">(Belum Ada)</div>
          )}
        </>
      </div>
    );
  }
}
