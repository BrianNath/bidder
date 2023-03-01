import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import fetchApi from "@/utils/fetchApi";
import UnauthorizedModal from "@/components/UnauthorizedModal";

export default function TopBar({ children }) {
  const [ddIsOpen, setDDIsOpen] = useState(false);
  const [userInformation, setUserInformation] = useState({});
  const [avatar, setAvatar] = useState("");
  const router = useRouter();
  const [openUnauthorizedModal, setOpenUnauthorizedModal] = useState(false);

  function toggleDD() {
    setDDIsOpen((isOpen) => !isOpen);
  }

  function showDialog() {
    setOpenUnauthorizedModal(true);
  }

  async function findSelfUserById() {
    const payload = {
      url: "/api/users/find-self-user-by-id",
      method: "GET",
      body: {},
    };
    const fetch = await fetchApi(payload);
    // console.log("FETCH : ", fetch);

    if (fetch.status == 401) {
      return showDialog();
    } else {
      localStorage.setItem("userData", JSON.stringify(fetch.record));
      setUserInformation(JSON.parse(localStorage.userData));
      return;
    }
  }

  async function logout() {
    const payload = {
      url: "/api/authentication/logout",
      method: "POST",
      body: {},
    };
    const fetch = await fetchApi(payload);
    console.log("FETCH:", fetch);
    if (fetch.isOk) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      router.push("/authentication/login");
    }
  }

  function getUserAvatar() {
    const userName = userInformation.name || "";
    const initials = userName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
    setAvatar(initials);
  }

  useEffect(() => {
    findSelfUserById();
  }, []);

  useEffect(() => {
    getUserAvatar();
  }, [userInformation]);

  return (
    <>
      <UnauthorizedModal isOpen={openUnauthorizedModal} />
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                <svg
                  className="hidden h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-3xl font-bold text-gray-400">Bidder</span>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <a
                    href=""
                    className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                    aria-current="page"
                  >
                    Dashboard
                  </a>

                  <a
                    href=""
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sell
                  </a>

                  <a
                    href=""
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Users
                  </a>

                  <a
                    href=""
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Auctions
                  </a>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
              </button>

              <div className="relative ml-3">
                <div>
                  <button
                    onClick={toggleDD}
                    type="button"
                    className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>

                    {userInformation?.name ? (
                      <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                          <span className="text-xs">{avatar}</span>
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
                  </button>
                </div>

                <div
                  className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 transition-all duration-300 ease-in-out ${
                    ddIsOpen ? "" : "opacity-0 translate-y-1"
                  }`}
                  id="menu"
                  aria-labelledby="menu-button"
                  role="menu"
                >
                  <button
                    href=""
                    className="px-4 py-3 w-full text-sm text-gray-700 flex gap-2 font-medium bg-white hover:bg-gray-200 rounded-t-md"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                    Profiles
                  </button>
                  <button
                    href=""
                    className="px-4 py-3 w-full text-sm text-gray-700 flex gap-2 font-medium bg-white hover:bg-gray-200"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </button>
                  <button
                    href=""
                    className="px-4 py-3 w-full text-sm text-gray-700 flex gap-2 font-medium bg-white hover:bg-gray-200 rounded-b-md"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                    onClick={logout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <a
              href=""
              className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
              aria-current="page"
            >
              Dashboard
            </a>

            <a
              href=""
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Team
            </a>

            <a
              href=""
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Projects
            </a>

            <a
              href=""
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Calendar
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
