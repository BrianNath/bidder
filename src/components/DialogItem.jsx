import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import fetchApi from "@/utils/fetchApi";
import { formatIDR } from "@/utils/numbering";
import { timestampToUI } from "@/utils/date";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import dynamic from "next/dynamic";
import handleUpdateItem from "@/lib/handleUpdateItem";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

export default function DialogItem({ isOpen, closeStateFunction, itemData }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [onLoading, setOnLoading] = useState(false);
  const [userData, setUserData] = useState({});

  const [condition, setCondition] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openPrice, setOpenPrice] = useState(0);
  const [richText, setRichText] = useState("");
  const [title, setTitle] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(0);

  const handleRichTextChange = (html) => {
    setRichText(html);
  };

  function handleSelectedCategory(event) {
    setSelectedCategory(event.target.value);
  }

  function handleOpenPrice(event) {
    !event.target.value ? (event.target.value = "0") : null;
    const rawValue = event.target.value.replace(/[^\d]/g, "");
    const formattedValue = parseInt(rawValue).toLocaleString();
    setOpenPrice(formattedValue);
  }

  async function handleEdit(event) {
    setOnLoading(true);
    event.preventDefault();

    console.log("OPENPRICE:", openPrice);

    const body = {
      title,
      itemName,
      quantity,
      condition,
      categoryId: selectedCategory,
      openPrice: parseInt(openPrice.replace(/\./g, "")),
      description: richText,
      // itemPicture: event.target.picture.files[0],
    };

    const response = await handleUpdateItem({ id: itemData.itemId, body });

    if (response != null) {
      closeStateFunction();
    }

    setOnLoading(false);
  }

  async function getAllCategories() {
    const payload = {
      url: "/api/categories/get-all-categories",
      method: "GET",
    };
    const fetch = await fetchApi(payload);
    if (fetch.isOk) {
      setCategoryList(fetch.record);
      setSelectedCategory(itemData.categoryId);
    }
  }

  async function handleDelete() {
    const payload = {
      url: "/api/items/delete",
      method: "POST",
      body: { id: itemData.itemId },
    };
    const fetch = await fetchApi(payload);
    if (fetch.isOk) {
      console.log("FETCH:", fetch);
      closeStateFunction();
    }
  }

  function init() {
    const formattedValue = parseInt(itemData.openPrice).toLocaleString();

    setCondition(itemData.condition);
    setOpenPrice(formattedValue);
    setRichText(itemData.description);
    setTitle(itemData.title);
    setQuantity(itemData.quantity);
    setItemName(itemData.itemName);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    init();
    getAllCategories();
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
                <div className="p-8 min-w-max">
                  <h1 className="mb-4 text-xl font-bold text-gray-500 flex items-center">
                    Modifikasi Detail Barang
                    <div className="tooltip" data-tip="Ubah Gambar Pada Tabel">
                      <button className="font-bold ml-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </h1>
                  <div className="gap-4 border p-4 rounded">
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
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
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
                          defaultValue={selectedCategory}
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
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                          autoComplete="itemName"
                          placeholder="Nama / Merk Barang"
                          required
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                          onChange={(e) => setQuantity(e.target.value)}
                          value={quantity}
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
                          onChange={(e) => setCondition(e.target.value)}
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
                          <span className="ml-2 text-sm text-gray-400">
                            Rupiah
                          </span>
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
                      <button
                        onClick={() => setShowConfirmDialog(true)}
                        className={`btn btn-error font-medium text-white bg-red-500 mx-3 px-8`}
                      >
                        Hapus
                      </button>
                      <button onClick={handleEdit} className={`btn mx-3 px-8`}>
                        Perbarui
                      </button>
                      <ConfirmDeleteDialog
                        isOpen={showConfirmDialog}
                        message="Hapus Barang Ini?"
                        functionHandler={handleDelete}
                        closeStateFunction={() => setShowConfirmDialog(false)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
