import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import fetchApi from "@/utils/fetchApi";
import UnauthorizedModal from "@/components/UnauthorizedModal";
import getUserAvatar from "@/utils/getUserAvatar";
import Link from "next/link";

export default function TopBar() {
  const router = useRouter();
  // const location = useLocation();

  const routes = [
    {
      name: "Dashboard",
      href: "/",
    },
    {
      name: "Auction",
      href: "/auction",
    },
    {
      name: "User",
      href: "/user",
    },
    {
      name: "Sell",
      href: "/sell",
    },
    {
      name: "Item",
      href: "/item",
    },
  ];

  const [ddIsOpen, setDDIsOpen] = useState(false);
  const [openUnauthorizedModal, setOpenUnauthorizedModal] = useState(false);
  const [userInformation, setUserInformation] = useState({});
  const [avatar, setAvatar] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  function toggleDD() {
    setDDIsOpen((isOpen) => !isOpen);
  }

  function toggleMenu() {
    setShowMenu((isOpen) => !isOpen);
  }

  function showDialog() {
    setOpenUnauthorizedModal(true);
  }

  async function findSelfUserById() {
    const payload = {
      url: "/api/user/find-user-by-id",
      method: "GET",
      body: {},
    };
    const fetch = await fetchApi(payload);
    // console.log("FETCH : ", fetch);

    if (fetch.status == 401) {
      return showDialog();
    } else {
      localStorage.setItem("userData", JSON.stringify(fetch.record));
      setUserInformation(fetch.record);
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
      router.push("/authentication");
    }
  }

  function getUserProfile() {
    const userName = userInformation?.name || "";
    const userAvatar = getUserAvatar(userName);
    setAvatar(userAvatar);
    setName(userName);
    // setRole(user.);
  }

  useEffect(() => {
    findSelfUserById();
    console.log(router);
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [userInformation]);

  return (
    <>
      <UnauthorizedModal isOpen={openUnauthorizedModal} />
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
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
                  {routes.map((route) => {
                    if (route.href !== "/") {
                      return router.asPath.startsWith(route.href) ? (
                        <Link
                          key={route.name}
                          href={route.href}
                          className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          {route.name}
                        </Link>
                      ) : (
                        <Link
                          key={route.name}
                          href={route.href}
                          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          {route.name}
                        </Link>
                      );
                    } else {
                      return router.asPath === "/" ? (
                        <Link
                          key={route.name}
                          href="/"
                          className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          key={route.name}
                          href="/"
                          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Dashboard
                        </Link>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <svg
                  onClick={() => router.push("/setting")}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div onClick={toggleDD} className="relative ml-3">
                <div>
                  <button
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
                  className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 ${
                    ddIsOpen ? "visible" : "hidden"
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

        <div className={`${showMenu ? "visible" : "hidden"}`} id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {routes.map((route) => {
              if (route.href !== "/") {
                return router.asPath.startsWith(route.href) ? (
                  <Link
                    key={route.name}
                    href={route.href}
                    className="bg-gray-900 block text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {route.name}
                  </Link>
                ) : (
                  <Link
                    key={route.name}
                    href={route.href}
                    className="text-gray-300 block hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {route.name}
                  </Link>
                );
              } else {
                return router.asPath === "/" ? (
                  <Link
                    key={route.name}
                    href="/"
                    className="bg-gray-900 block text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    key={route.name}
                    href="/"
                    className="text-gray-300 block hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                );
              }
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
