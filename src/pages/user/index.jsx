import fetchApi from "@/utils/fetchApi";
import { useState, useEffect } from "react";
import getUserAvatar from "@/utils/getUserAvatar";
import { timestampToUI } from "@/utils/date";
import { motion, AnimatePresence } from "framer-motion";

export default function User() {
  const [userList, setUserList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  async function getUsersLazy() {
    setUsersLoading(true);
    const payload = {
      url: "/api/users/get-users-lazy/0.20",
      method: "GET",
    };
    const fetch = await fetchApi(payload);

    if (fetch.isOk) {
      console.log("FETCH : ", fetch.record.items);
      const neededData = fetch.record.items.map((user) => {
        return neededUserData(user);
      });
      setUserList(neededData);
      console.log("NEEDED DATA: ", neededData);
    }
    setUsersLoading(false);
  }

  function neededUserData(data) {
    const username = data.name;
    let email = "secret";
    if (data.emailVisibility) {
      email = data.email;
    }
    const created = timestampToUI(data.created);
    const roleName = data.expand.roleId.roleName;
    const id = data.id;

    return {
      id,
      username,
      email,
      created,
      roleName,
    };
  }

  function showDeleteModal(data) {
    setShowConfirmDialog(true);
    setSelectedUser(data);
  }

  async function handleUserDelete() {
    if (!selectedUser?.id) return;
    console.log("USER ID:", selectedUser.id);
    const payload = {
      url: "/api/users/delete",
      method: "DELETE",
      body: {
        id: selectedUser.id,
      },
    };
    const fetch = await fetchApi(payload);
    if (fetch.isOk) {
      getUsersLazy();
    }
  }

  function handleUserEdit(data) {
    setSelectedUser(data);
    console.log(data);
  }

  useEffect(() => {
    getUsersLazy();
  }, []);

  return usersLoading ? (
    <>Loading</>
  ) : (
    <>
      <div className="rounded-lg shadow p-5 bg-white">
        <h1 className="text-2xl font-semibold text-gray-500 mb-4">
          Daftar Pengguna
        </h1>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Nama</th>
                <th>Email</th>
                <th>Jabatan</th>
                <th>Tanggal Dibuat</th>
              </tr>
            </thead>
            <ConfirmDeleteDialog
              isOpen={showConfirmDialog}
              message="Hapus Pengguna Ini?"
              functionHandler={() => handleUserDelete(selectedUser)}
              closeStateFunction={() => setShowConfirmDialog(false)}
            />
            <tbody>
              {userList.map((user) => {
                return (
                  <tr key={user.username} className="text-gray-500 font-medium">
                    <td className="w-36">
                      <ul className="menu menu-horizontal bg-base-100 rounded-box">
                        <li>
                          <button
                            className="active:bg-gray-400 hover:text-blue-500"
                            onClick={() => handleUserEdit(user)}
                          >
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
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                          </button>
                        </li>
                        <li>
                          <button
                            className="active:bg-gray-400 hover:text-red-500"
                            onClick={() => showDeleteModal(user)}
                          >
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
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </li>
                      </ul>
                    </td>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                              <span className="text-xs">
                                {getUserAvatar(user.username)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="font-medium">{user.username}</div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.roleName}</td>
                    <td>{user.created}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ConfirmDeleteDialog({
  isOpen,
  message,
  closeStateFunction,
  functionHandler,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
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
            className="relative bg-white max-w-xl mx-3 rounded-lg shadow-lg"
            initial={{ translateY: 100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full h-full max-w-md md:h-auto">
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
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-6 text-center">
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
                    {message}
                  </h3>
                  <button
                    onClick={functionHandler}
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                  >
                    Yes, I'm sure
                  </button>
                  <button
                    onClick={closeStateFunction}
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    No, cancel
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
