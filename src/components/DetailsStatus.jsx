import { timeAgo } from "@/utils/date";

export default function DetailsStatus({ status, timeEnd }) {
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
