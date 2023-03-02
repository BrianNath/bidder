import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import fetchApi from "@/utils/fetchApi";
import Layout from "../../components/Layout";

export default function AuctionDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [auctionDetails, setAuctionDetails] = useState({});

  async function getAuctionDetails() {
    const payload = {
      url: `/api/auction/${id}`,
      method: "GET",
    };
    const fetch = await fetchApi(payload);

    if (fetch.isOk) {
      console.log(fetch);
      setAuctionDetails(fetch.record);
    }
  }

  useEffect(() => {
    getAuctionDetails();
  }, [id]);

  return <>{id}</>;
}
