import React, { useEffect, useState } from "react";
import fetchApi from "@/utils/fetchApi";
import handleAddItem from "@/lib/handleAddItem";
import router from "next/router";
import ProtectedRoute from "@/lib/ProtectedRoute";
import dynamic from "next/dynamic";
import Calendar from "@/components/Calendar";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

export default function Sell() {
  const [condition, setCondition] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [onLoading, setOnLoading] = useState(false);
  const [openPrice, setOpenPrice] = useState(0);
  const [richText, setRichText] = useState("");
  const [userData, setUserData] = useState({});
  const [calendar, setCalendar] = useState(new Date());

  const handleRichTextChange = (html) => {
    setRichText(html);
  };

  function handleConditionChange(event) {
    setCondition(event.target.value);
  }

  function handleSelectedCategory(event) {
    setSelectedCategory(event.target.value);
  }

  function handleOpenPrice(event) {
    !event.target.value ? (event.target.value = "0") : null;
    const rawValue = event.target.value.replace(/[^\d]/g, "");
    const formattedValue = parseInt(rawValue).toLocaleString();
    setOpenPrice(formattedValue);
    // console.log(openPrice);
  }

  async function handleSellItem(event) {
    setOnLoading(true);
    event.preventDefault();

    const body = {
      title: event.target.title.value,
      itemName: event.target.itemName.value,
      quantity: event.target.quantity.value,
      condition: condition,
      creatorId: userData.id,
      categoryId: selectedCategory,
      openPrice: parseInt(openPrice.replace(/\./g, "")),
      description: richText,
      itemPicture: event.target.picture.files[0],
    };

    // console.log("BODY:", body);
    const response = await handleAddItem(body);

    // console.log(response);

    if (response != null) {
      router.push("/item");
    }

    setOnLoading(false);
  }

  async function getAllCategories() {
    const payload = {
      url: "/api/categories/get-all-categories",
      method: "GET",
    };
    const fetch = await fetchApi(payload);
    // console.log("FETCH : ", fetch);
    if (fetch.isOk) {
      setCategoryList(fetch.record);
      setSelectedCategory(categoryList[0]?.id);
    }
  }

  useEffect(() => {
    if (!localStorage.userData) {
      return;
    } else {
      setUserData(JSON.parse(localStorage.userData));
    }
    getAllCategories();
  }, []);

  return (
    <ProtectedRoute requiredRole="sellItems">
      <div className="rounded-lg shadow p-5 bg-white">
        <h1 className="text-2xl font-semibold text-gray-500 mb-4">
          Jual Barang
          <form
            encType="multipart/form-data"
            onSubmit={handleSellItem}
            className="gap-4 mt-4 border rounded p-3"
          >
            <div className="w-full">
              <label
                htmlFor="title"
                className="block mb-2 text-lg font-medium text-gray-900"
              >
                Judul
              </label>
              <input
                id="title"
                name="title"
                type="text"
                autoComplete="title"
                placeholder="Judul Barang"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <div className="w-full">
                <label
                  htmlFor="category"
                  className="block mb-2 text-lg font-medium text-gray-900"
                >
                  Kategori
                </label>
                <select
                  className="select select-bordered w-full"
                  placeholder="Pilih Kategori"
                  value={selectedCategory}
                  required
                  onChange={handleSelectedCategory}
                >
                  {categoryList.map((category) => {
                    return (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="w-full">
                <label
                  htmlFor="itemName"
                  className="block mb-2 text-lg font-medium text-gray-900"
                >
                  Nama Barang
                </label>
                <input
                  id="itemName"
                  name="itemName"
                  type="text"
                  autoComplete="itemName"
                  placeholder="Nama / Merk Barang"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="picture"
                  className="block mb-2 text-lg font-medium text-gray-900"
                >
                  Gambar Barang
                </label>
                <input
                  required
                  type="file"
                  id="picture"
                  className="file-input file-input-bordered w-full max-w-xs"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <div className="w-full">
                <label
                  htmlFor="quantity"
                  className="block mb-2 text-lg font-medium text-gray-900"
                >
                  Total Barang
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  autoComplete="quantity"
                  placeholder="Kuantitas"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="condition"
                  className="block mb-2 text-lg font-medium text-gray-900"
                >
                  Kondisi
                  <span className="ml-2 text-sm text-gray-400">
                    {condition}/100
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  required
                  value={condition}
                  onChange={handleConditionChange}
                  className="range"
                  id="condition"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="openPrice"
                  className="block mb-2 text-lg font-medium text-gray-900"
                >
                  Harga Pembukaan
                  <span className="ml-2 text-sm text-gray-400">Rupiah</span>
                </label>
                <input
                  id="openPrice"
                  name="openPrice"
                  type="text"
                  onChange={handleOpenPrice}
                  value={openPrice}
                  autoComplete="openPrice"
                  placeholder="Harga Awal"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full">
                <label
                  htmlFor="timeStart"
                  className="block mb-2 text-lg font-medium text-gray-900"
                >
                  Mulai Lelang
                </label>
                <Calendar date={calendar} setDate={setCalendar} styleClass="text-lg border p-3 showIcon" />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="description"
                className="block mb-2 text-lg font-medium text-gray-900"
              >
                Deskripsi
              </label>
              <RichTextEditor
                onChange={handleRichTextChange}
                value={richText}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button className={`btn mx-3 px-8 `}>Kirim</button>
            </div>
          </form>
        </h1>
      </div>
    </ProtectedRoute>
  );
}
