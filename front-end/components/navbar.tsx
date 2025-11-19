"use client";
import { usePathname } from "next/navigation";
import { Navbar as Nav, NavbarContent, NavbarItem } from "@heroui/navbar";
import Link from "next/link";

const activeClasses =
  "data-[active=true]:bg-secondary data-[active=true]:rounded-2xl data-[active=true]:font-extrabold";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
      <Nav className="py-3 mb-24">
        <NavbarContent justify="center" className="gap-x-10 w-full">
          <NavbarItem
            isActive={pathname === "/"}
            className={`px-7 py-3 ${activeClasses}`}
          >
            <Link href={"/"} className="flex text-2xl items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="32px"
                viewBox="0 -960 960 960"
                width="32px"
                fill="#e3e3e3"
              >
                <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
              </svg>
              Home
            </Link>
          </NavbarItem>
          <NavbarItem
            isActive={pathname === "/movies"}
            className={`px-7 py-3 ${activeClasses}`}
          >
            <Link href={"/movies"} className="flex text-2xl items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="32px"
                viewBox="0 -960 960 960"
                width="32px"
                fill="#e3e3e3"
              >
                <path d="m160-800 80 160h120l-80-160h80l80 160h120l-80-160h80l80 160h120l-80-160h120q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800Zm0 240v320h640v-320H160Zm0 0v320-320Z" />
              </svg>
              Movies
            </Link>
          </NavbarItem>
          <NavbarItem
            isActive={pathname === "/tfidf"}
            className={`px-7 py-3 ${activeClasses}`}
          >
            <Link href={"/tfidf"} className="flex text-2xl items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="29px"
                viewBox="0 -960 960 960"
                width="29px"
                fill="#e3e3e3"
              >
                <path d="M200-800v241-1 400-640 200-200Zm0 720q-33 0-56.5-23.5T120-160v-640q0-33 23.5-56.5T200-880h320l240 240v100q-19-8-39-12.5t-41-6.5v-41H480v-200H200v640h241q16 24 36 44.5T521-80H200Zm460-120q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29ZM864-40 756-148q-21 14-45.5 21t-50.5 7q-75 0-127.5-52.5T480-300q0-75 52.5-127.5T660-480q75 0 127.5 52.5T840-300q0 26-7 50.5T812-204L920-96l-56 56Z" />
              </svg>
              TF-IDF
            </Link>
          </NavbarItem>
          <NavbarItem
            isActive={pathname === "/ncf"}
            className={`px-7 py-3 ${activeClasses}`}
          >
            <Link href={"/ncf"} className="flex text-2xl items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="35px"
                viewBox="0 -960 960 960"
                width="35px"
                fill="#e3e3e3"
              >
                <path d="M323-160q-11 0-20.5-5.5T288-181l-78-139h58l40 80h92v-40h-68l-40-80H188l-57-100q-2-5-3.5-10t-1.5-10q0-4 5-20l57-100h104l40-80h68v-40h-92l-40 80h-58l78-139q5-10 14.5-15.5T323-800h97q17 0 28.5 11.5T460-760v160h-60l-40 40h100v120h-88l-40-80h-92l-40 40h108l40 80h112v200q0 17-11.5 28.5T420-160h-97Zm217 0q-17 0-28.5-11.5T500-200v-200h112l40-80h108l-40-40h-92l-40 80h-88v-120h100l-40-40h-60v-160q0-17 11.5-28.5T540-800h97q11 0 20.5 5.5T672-779l78 139h-58l-40-80h-92v40h68l40 80h104l57 100q2 5 3.5 10t1.5 10q0 4-5 20l-57 100H668l-40 80h-68v40h92l40-80h58l-78 139q-5 10-14.5 15.5T637-160h-97Z" />
              </svg>
              NCF
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Nav>
    </>
  );
};
