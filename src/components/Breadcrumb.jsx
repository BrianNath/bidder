import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

function Breadcrumb() {
  const router = useRouter();

  const pathSegments = router.asPath
    .split("/")
    .filter((segment) => segment !== "");

  return (
    <nav className="flex items-center text-gray-600 text-sm font-medium max-w-max">
      <Link href="/">
        <span className="font-bold text-xl">Bidder</span>
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
            className="text-lg"
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
