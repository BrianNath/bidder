import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

function Breadcrumb() {
  const router = useRouter();

  const pathSegments = router.asPath
    .split("/")
    .filter((segment) => segment !== "");

  return (
    <nav className="flex items-center h-6 text-gray-600 text-sm font-medium max-w-max">
      <Link href="/">
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
        </svg>
      </Link>
      {pathSegments.map((segment, index) => (
        <React.Fragment key={segment}>
          <svg
            aria-hidden="true"
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          <Link
            className="text-lg pb-1"
            href={`/${pathSegments.slice(0, index + 1).join("/")}`}
          >
            {segment}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}

export default Breadcrumb;
