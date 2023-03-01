import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

function Breadcrumb() {
  const router = useRouter();

  const pathSegments = router.asPath
    .split("/")
    .filter((segment) => segment !== "");

  return (
      <nav className="flex items-center text-white text-sm font-medium p-3 rounded max-w-max drop-shadow-md bg-gray-800">
        <Link href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
        </Link>
        {pathSegments.map((segment, index) => (
          <React.Fragment key={segment}>
            <svg
              className="mx-2 w-3 h-3 text-gray-300"
              fill="currentColor"
              viewBox="0 0 12 12"
            >
              <path
                fillRule="evenodd"
                d="M11.5 6a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1 0-1h10a.5.5 0 0 1 .5.5z"
              />
            </svg>
            <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
              {segment}
            </Link>
          </React.Fragment>
        ))}
      </nav>
  );
}

export default Breadcrumb;
