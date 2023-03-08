import { useRouter } from "next/router";

function Home() {
  const router = useRouter();
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
