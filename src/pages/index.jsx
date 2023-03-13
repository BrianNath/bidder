import { useRouter } from "next/router";

function Home() {
  const router = useRouter();
  const categories = ["Makanan", "Obat Nyamuk"];

  return (
    <>
      <main className="w-full m-auto bg-gray-200 rounded-lg">
        <div className="bg-gray-100 bg-opacity-30 p-6 border text-center border-opacity-40 shadow-lg glass-container">
          <h1 className="font-bold text-gray-800 text-4xl">
            Selamat Datang Di Bidder!
          </h1>
          <p className="text-gray-600 font-medium mt-2">Mulai Lelang Kamu!</p>
          <div className="mt-2 flex items-center justify-center rounded border-2 border-gray-200 p-7">
            <div className="w-full">
              <img src="/home-page.svg" alt="Landing Page" className="w-full" />
            </div>
            <div
              className="w-3 rounded-full bg-gray-200 mx-12"
              style={{ height: "300px" }}
            />
            <div className="w-full h-full m-auto">
              <p className="mb-4 text-xl font-medium text-gray-400">Kamu bisa mulai lelang kamu mulai dari Rp.1000</p>
              <button onClick={()=>router.push("/auction")} className="btn btn-lg rounded-full mb-5">
                Mulai Lelang
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
