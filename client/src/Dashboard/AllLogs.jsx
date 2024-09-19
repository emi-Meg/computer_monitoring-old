import React, { useState, useEffect, useMemo } from "react";
import SideBar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTable, useSortBy } from "react-table";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import Swal from "sweetalert2";
import {
  Breadcrumbs,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import Header from "./Header";
import HomeIcon from "@mui/icons-material/Home";
import DevicesIcon from "@mui/icons-material/Devices";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AllLogs() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setFilteredLogs(logs);
  }, [logs]);

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filteredData = logs.filter(
      (log) =>
        log.log_data.toLowerCase().includes(searchValue) ||
        log.user.firstName.toLowerCase().includes(searchValue) ||
        log.user.lastName.toLowerCase().includes(searchValue) ||
        log.computer_user?.name.toLowerCase().includes(searchValue) ||
        log.created_at.toLowerCase().includes(searchValue)
      );

    setFilteredLogs(filteredData);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const log = response.data.logs;

        setLogs(log);
      } catch (error) {
        console.error("Error all logs:", error);
        if (error.response.status === 404) {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleClickOpen = (log) => {
    setSelectedLog(log);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedLog(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Logger",
        accessor: "user",
        Cell: ({ value }) =>
          `${value?.firstName || ""} ${value?.lastName || ""}`,
        sortType: "basic",
      },
      {
        Header: "Log data",
        accessor: "log_data",
        sortType: "basic",
      },
      {
        Header: "Computer user",
        accessor: "computer_user",
        Cell: ({ value }) => value?.name || "No record",
        sortType: "basic",
      },
      {
        Header: "Date",
        accessor: "created_at",
        Cell: ({ value }) => format(new Date(value), "MMMM d, yyyy"),
        sortType: "basic",
      },
    ],
    []
  );

  const data = useMemo(() => filteredLogs, [filteredLogs]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
    setSortBy,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const title = "All Logs";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header toggleSidebar={toggleSidebar} title={title} />
      <div style={{ display: "flex", flex: 1 }}>
        <div>
          <SideBar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>
        <div style={{ flex: 2, paddingBottom: "50px" }}>
          <p className="pt-10 ml-10 text-2xl font-normal">All Logs</p>
          <div className="mt-2 ml-10">
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                sx={{ display: "flex", alignItems: "center" }}
                color="inherit"
                path
                to="/dashboard"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
              </Link>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.primary"
              >
                <DevicesIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                All Logs
              </Typography>
            </Breadcrumbs>
          </div>
          <br /> <br />
          <div className="h-full ml-10 mr-10">
            {/* Search bar */}
            <TextField
              label="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              fullWidth
              sx={{ width: 300 }}
              size="small"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TableContainer className="mt-1 bg-white rounded-lg shadow-md">
              <Table {...getTableProps()}>
                <TableHead>
                  {headerGroups.map((headerGroup) => (
                    <TableRow
                      className="bg-blue-400"
                      {...headerGroup.getHeaderGroupProps()}
                    >
                      {headerGroup.headers.map((column) => (
                        <TableCell
                          align="center"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          style={{ cursor: "pointer" }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            color={"white"}
                          >
                            {column.render("Header")}
                            <span className="ml-2">
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <FontAwesomeIcon icon={faArrowDown} />
                                ) : (
                                  <FontAwesomeIcon icon={faArrowUp} />
                                )
                              ) : (
                                ""
                              )}
                            </span>
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4}>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-full p-4 rounded">
                            <div className="flex space-x-4 animate-pulse">
                              <div className="flex-1 py-1 space-y-6">
                                <div className="h-10 bg-gray-200 rounded shadow"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        prepareRow(row);
                        return (
                          <TableRow {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                              <TableCell
                                align="center"
                                {...cell.getCellProps()}
                              >
                                {cell.render("Cell")}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })
                  )}
                  {!loading && filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        {searchTerm
                          ? `No "${searchTerm}" result found.`
                          : "No logs found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 15, 20]}
                component="div"
                count={filteredLogs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={
                  <Typography variant="subtitle" fontWeight={600}>
                    Entries Per Page:
                  </Typography>
                }
              />
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllLogs;