import { useRouter } from "next/router";

function Home() {
  const router = useRouter();
  return (
    <>
      <main className="w-8/12 m-auto">Home Sweet Home</main>
    </>
  );
}

export default Home;
