import React, { useState, useEffect } from "react";
import smct from "../img/smct.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faDesktop,
  faQrcode,
  faWrench,
  faComputer,
  faX,
  faFile,
  faArrowsTurnToDots,
  faUsers,
  faAngleRight,
  faAngleDown,
  faCodeBranch,
  faChair,
  faBoxesPacking,
  faBuildingUser,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

function SideBar({ isSidebarOpen, toggleSidebar }) {
  const [activeItem, setActiveItem] = useState();
  const [setupOpen, setSetupOpen] = useState(false);
  const [transferedOpen, setTransferedOpen] = useState(false);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const hashPath = window.location.pathname.replace("", "");
    switch (hashPath) {
      case "/dashboard":
        setActiveItem("dashboard");
        break;
      case "/computers":
        setActiveItem("computers");
        break;
      case "/qr":
        setActiveItem("qr");
        break;
      case "/transfered-units":
        setActiveItem("transfered-units");
        break;
      case "/transfered-branch-units":
        setActiveItem("transfered-branch-units");
        break;
      case "/all-units":
        setActiveItem("all-units");
        break;
      case "/all-logs":
        setActiveItem("all-logs");
        break;
      case "/branches":
        setActiveItem("branches");
        break;
      case "/positions":
        setActiveItem("positions");
        break;
      case "/categories":
        setActiveItem("categories");
        break;
      case "/suppliers":
        setActiveItem("suppliers");
        break;
      case "/departments":
        setActiveItem("departments");
        break;
      case "/unit":
        setActiveItem("unit");
        break;
      case "/set":
        setActiveItem("set");
        break;
      case "/user":
        setActiveItem("user");
        break;
      case "/setup/branch-units":
        setActiveItem("setup-branch-units");
        break;
      case "/admin/users-list":
        setActiveItem("users-list");
        break;
      default:
        setActiveItem("dashboard");
    }
  }, []);

  const handleSetupOpen = () => {
    setSetupOpen((prev) => !prev);
  };
  const handleTransferedOpen = () => {
    setTransferedOpen((prev) => !prev);
  };

  return (
    <div
      className={`fixed md:static ${
        isSidebarOpen ? "left-0 w-80 overflow-y-auto" : "-left-full w-72"
      } top-0 h-full shadow-[4px_0_10px_rgba(0,0,0,0.25)] bg-white transition-all duration-300 z-50`}
    >
      <div className="pb-2 pr-5 w-72">
        <div>
          <button
            onClick={toggleSidebar}
            className="mt-4 text-black float-end md:hidden"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
          <img
            src={smct}
            alt="SMCT Logo"
            className="block pt-5 ml-10 w-60 h-28"
          />
        </div>
        <div className="mt-5 ml-10">
          <Link to="/dashboard">
            <button
              className={`text-lg font-medium pl-5 pt-0.5 w-full text-justify hover:bg-blue-400 hover:text-white ${
                activeItem === "dashboard"
                  ? "bg-blue-500 text-white active"
                  : ""
              } rounded-3xl h-10 cursor-pointer`}
            >
              <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
            </button>
          </Link>
          <Link to="/computers">
            <button
              className={`text-lg font-medium mt-5 pl-5 pt-0.5 w-full text-justify hover:bg-blue-400 hover:text-white ${
                activeItem === "computers"
                  ? "bg-blue-500 text-white active"
                  : ""
              } rounded-3xl h-10 cursor-pointer`}
            >
              <FontAwesomeIcon icon={faDesktop} /> Monitored Computers
            </button>
          </Link>
          <Link to="/qr">
            <button
              className={`text-lg font-medium mt-5 pl-5 pt-0.5 w-full text-justify hover:bg-blue-400 hover:text-white ${
                activeItem === "qr" ? "bg-blue-500 text-white active" : ""
              } rounded-3xl h-10 cursor-pointer`}
            >
              <FontAwesomeIcon icon={faQrcode} /> Scan QR Codes
            </button>
          </Link>
          <Link to="/all-units">
            <button
              className={`text-lg font-medium mt-5 pl-5 pt-0.5 w-full text-justify hover:bg-blue-400 hover:text-white ${
                activeItem === "all-units"
                  ? "bg-blue-500 text-white active"
                  : ""
              } rounded-3xl h-10 cursor-pointer`}
            >
              <FontAwesomeIcon icon={faComputer} /> All Units
            </button>
          </Link>
          <Link to="/all-logs">
            <button
              className={`text-lg font-medium mt-5 pl-5 pt-0.5 w-full text-justify hover:bg-blue-400 hover:text-white ${
                activeItem === "all-logs" ? "bg-blue-500 text-white active" : ""
              } rounded-3xl h-10 cursor-pointer`}
            >
              <FontAwesomeIcon icon={faFile} /> All Logs
            </button>
          </Link>
          <Link to="/branches">
            <button
              className={`text-lg font-medium mt-5 pl-5 pt-0.5 w-full text-justify hover:bg-blue-400 hover:text-white ${
                activeItem === "branches" ? "bg-blue-500 text-white active" : ""
              } rounded-3xl h-10 cursor-pointer`}
            >
              <FontAwesomeIcon icon={faCodeBranch} /> Branches
            </button>
          </Link>
          <Link to="/categories">
            <button
              className={`text-lg font-medium mt-5 pl-5 pt-0.5 w-full text-justify hover:bg-blue-400 hover:text-white ${
                activeItem === "categories"
                  ? "bg-blue-500 text-white active"
                  : ""
              } rounded-3xl h-10 cursor-pointer`}
            >
              <FontAwesomeIcon icon={faList} /> Categories
            </button>
          </Link>
          <Link to="/positions">
            <button
              className={`text-lg font-medium mt-5 pl-5 pt-0.5 w-full text-justify hover:bg-blue-400 hover:text-white ${
                activeItem === "positions"
                  ? "bg-blue-500 text-white active"
                  : ""
              } rounded-3xl h-10 cursor-pointer`}
            >
              <FontAwesomeIcon icon={faChair} /> Positions
            </button>
          </Link>
          <Link to="/suppliers">
            <button
              className={`text-lg font-medium mt-5 pl-5 pt-0.5 w-full text-justify hover:bg-blue-400 hover:text-white ${
                activeItem === "suppliers"
                  ? "bg-blue-500 text-white active"
                  : ""
              } rounded-3xl h-10 cursor-pointer`}
            >
              <FontAwesomeIcon icon={faBoxesPacking} /> Suppliers
            </button>
          </Link>
          <Link to="/departments">
            <button
              className={`text-lg font-medium mt-5 pl-5 pt-0.5 w-full text-justify hover:bg-blue-400 hover:text-white ${
                activeItem === "departments"
                  ? "bg-blue-500 text-white active"
                  : ""
              } rounded-3xl h-10 cursor-pointer`}
            >
              <FontAwesomeIcon icon={faBuildingUser} /> Departments
            </button>
          </Link>
          {isAdmin && (
            <Link to="/admin/users-list">
              <button
                className={`text-lg font-medium mt-5 pl-5 pt-0.5 w-full text-justify hover:bg-blue-400 hover:text-white ${
                  activeItem === "users-list"
                    ? "bg-blue-500 text-white active"
                    : ""
                } rounded-3xl h-10 cursor-pointer`}
              >
                <FontAwesomeIcon icon={faUsers} /> Users List
              </button>
            </Link>
          )}
          <p
            onClick={handleTransferedOpen}
            className={`cursor-pointer text-lg flex justify-between font-medium mt-5 pl-5 pt-0.5 rounded-3xl h-10`}
          >
            <div>
              <FontAwesomeIcon icon={faArrowsTurnToDots} /> Transfered Units
            </div>
            <div>
              <FontAwesomeIcon
                icon={transferedOpen ? faAngleDown : faAngleRight}
              />
            </div>
          </p>

          {transferedOpen && (
            <div className="p-3 text-center bg-gray-200 rounded-lg">
              <Link to="/transfered-units">
                <button
                  className={`text-md font-medium mt-5 px-6 text-justify pt-0.5 hover:bg-blue-400 hover:text-white ${
                    activeItem === "transfered-units"
                      ? "bg-blue-500 text-white active"
                      : ""
                  } rounded  h-10 w-full cursor-pointer`}
                >
                  User Unit Transfered
                </button>
              </Link>
              <Link to="/transfered-branch-units">
                <button
                  className={`text-sm font-medium mt-5 mb-6 px-6 text-justify pt-0.5 hover:bg-blue-400 hover:text-white ${
                    activeItem === "transfered-branch-units"
                      ? "bg-blue-500 text-white active"
                      : ""
                  } rounded h-10 w-full cursor-pointer`}
                >
                  Branch Unit Transfered
                </button>
              </Link>
            </div>
          )}
          <p
            onClick={handleSetupOpen}
            className={`cursor-pointer text-lg flex justify-between font-medium mt-5 pl-5 pt-0.5 rounded-3xl h-10`}
          >
            <div>
              <FontAwesomeIcon icon={faWrench} /> Setup
            </div>
            <div>
              <FontAwesomeIcon icon={setupOpen ? faAngleDown : faAngleRight} />
            </div>
          </p>
          {setupOpen && (
            <div className="p-3 text-center bg-gray-200 rounded-lg">
              <Link to="/unit">
                <button
                  className={`text-md font-medium mt-5 px-8 text-justify pt-0.5 hover:bg-blue-400 hover:text-white ${
                    activeItem === "unit" ? "bg-blue-500 text-white active" : ""
                  } rounded h-10 w-full cursor-pointer`}
                >
                  Unit
                </button>
              </Link>
              <Link to="/set">
                <button
                  className={`text-sm font-medium mt-5 px-8 text-justify pt-0.5 hover:bg-blue-400 hover:text-white ${
                    activeItem === "set" ? "bg-blue-500 text-white active" : ""
                  } rounded h-10 w-full cursor-pointer`}
                >
                  Assign Computer Set
                </button>
              </Link>
              <Link to="/setup/branch-units">
                <button
                  className={`text-sm font-medium mt-5 px-8 text-justify pt-0.5 hover:bg-blue-400 hover:text-white ${
                    activeItem === "setup-branch-units"
                      ? "bg-blue-500 text-white active"
                      : ""
                  } rounded h-10 w-full cursor-pointer`}
                >
                  Assign Branch Unit
                </button>
              </Link>
              <Link to="/user">
                <button
                  className={`text-md font-medium mt-5 px-8 text-justify pt-0.5 hover:bg-blue-400 hover:text-white ${
                    activeItem === "user" ? "bg-blue-500 text-white active" : ""
                  } rounded h-10 w-full cursor-pointer`}
                >
                  User
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
