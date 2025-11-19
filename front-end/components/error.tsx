import { Divider } from "@heroui/divider";
import React from "react";

interface ErrorComponent {
  text: string;
}

const ErrorComponent = ({ text }: ErrorComponent) => {
  return (
    <>
      <div className="text-6xl flex flex-col items-center gap-5 text-center text-red-400">
        <div className="flex items-center gap-5">
          <p>{text}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="50px"
            viewBox="0 -960 960 960"
            width="50px"
            fill="#e3e3e3"
          >
            <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
        </div>

        <Divider />
        <p>Services currently unnavailable.</p>
      </div>
    </>
  );
};

export default ErrorComponent;
