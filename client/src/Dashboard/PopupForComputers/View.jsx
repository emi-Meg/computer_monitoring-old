import React, { useState, useEffect, useMemo } from "react";
import smct from "./../../img/smct.png";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Button,
  DialogActions,
  IconButton,
  DialogTitle,
  Dialog,
  DialogContent,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import axios from "../../api/axios";
import PrintInformation from "./Print";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useTable, useSortBy } from "react-table";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    margin: "auto",
    width: "100%",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function View({ isOpen, onClose, viewPopupData, setViewPopupData, onSubmit }) {
  const [showAll, setShowAll] = useState(false);
  const [rows, setRows] = useState([]);
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applicationContent, setApplicationContent] = useState([]);
  const [position, setPosition] = useState({ positions: [] });
  const [branchcode, setBranchcode] = useState({ branches: [] });
  const [error, setError] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [user, setUser] = useState({
    application_content: applicationContent,
    email: viewPopupData.email ? viewPopupData.email : null,
    position: viewPopupData.position ? viewPopupData.position.id : null,
    branch_code: viewPopupData.branch_code
      ? viewPopupData.branch_code.id
      : null,
  });
  const [redirectToPrint, setRedirectToPrint] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const dismissAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    if (redirectToPrint) {
      window.open(`/print/${id}`, "_blank");
    }
  }, [redirectToPrint]);

  const handleClick = () => {
    setRedirectToPrint(true);
  };

  useEffect(() => {
    setUser({
      application_content: applicationContent,
      email: viewPopupData.email,
      branch_code: viewPopupData.branch_code
        ? viewPopupData.branch_code.id
        : null,
      position: viewPopupData.position ? viewPopupData.position.id : null,
    });
  }, [viewPopupData]);

  const handleBranchCodeChange = (event, newValue) => {
    setUser({
      ...user,
      branch_code: newValue ? newValue.id : null,
    });
  };

  const handleEmailChange = (event) => {
    const newValue = event.target.value
      ? event.target.value
      : viewPopupData.email;

    setUser({
      ...user,
      email: newValue ? newValue : null,
    });
  };

  const handlePositionChange = (event, newValue) => {
    setUser({
      ...user,
      position: newValue ? newValue.id : null,
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApplications = (event, newValue) => {
    event.preventDefault();
    setApplicationContent(newValue);
  };

  useEffect(() => {
    const fetchBrancheCode = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/branches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBranchcode(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchBrancheCode();
  }, []);
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/positions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosition(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchPosition();
  }, []);

  useEffect(() => {
    if (viewPopupData?.computers) {
      const apps = viewPopupData.computers.flatMap((computer) =>
        computer.installed_applications.map((app) => app.application_content)
      );
      setApplicationContent(apps);
    }
  }, [viewPopupData]);

  useEffect(() => {
    if (viewPopupData?.computers) {
      const specsData = viewPopupData.computers.flatMap((computer) =>
        computer.units.map((unit) => ({
          ...unit,
          computerName: computer.name,
        }))
      );
      setRows(specsData);

      const ids = viewPopupData.computers.map((comp) => comp.id);
      setId(ids);
    }
  }, [viewPopupData]);

  const handleViewMore = () => {
    setShowAll(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: "UNIT CODE",
        accessor: "unit_code",
        id: "unit_code",
      },
      {
        Header: "CATEGORY",
        accessor: "category.category_name",
        id: "category",
      },
      {
        Header: "STATUS",
        accessor: "status",
        id: "status",
      },
    ],
    []
  );

  const dataPop = useMemo(() => [viewPopupData], [viewPopupData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows: tableRows,
    prepareRow,
    state: { sortBy },
    setSortBy,
  } = useTable(
    {
      columns,
      data: rows,
    },
    useSortBy
  );

  if (!isOpen) {
    return null; // Render nothing if isOpen is false
  }

  const fstatus = viewPopupData.computers.map(
    (fstatus) => fstatus.formatted_status
  );

  const Position =
    position.positions && position.positions.length > 0
      ? position.positions.map((pos) => ({
          id: pos.id,
          position_name: pos.position_name,
        }))
      : [];

  // This is a sample data for Branchcode
  const Branchcode =
    branchcode.branches && branchcode.branches.length > 0
      ? branchcode.branches.map((branch) => ({
          id: branch.id,
          branch_name: branch.branch_name,
        }))
      : [];
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    onSubmit(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.put(
        `api/installed/${id[0]}/computer-user/${viewPopupData.id}`,
        {
          application_content: applicationContent,
          email: user.email,
          position: user.position,
          branch_code: user.branch_code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === true) {
        const updatedResponse = await axios.get(
          `/api/computer-user-specs/${viewPopupData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setViewPopupData(updatedResponse.data.computer_user_specs);
        handleClose();
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "green",
          customClass: {
            popup: "colored-toast",
            container: "swalContainer",
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true,
        });
        (async () => {
          await Toast.fire({
            icon: "success",
            title: response.data.message,
          });
        })();
        setValidationErrors("");
      }
      console.log("Adding computer set:", response.data);
    } catch (error) {
      console.error("Error in adding computer set:", error);
      if (error.response && error.response.data) {
        console.log("Backend error response:", error.response.data);
        setError(error.response.data.message);
        setValidationErrors(error.response.data.errors || {});
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "red",
          customClass: {
            popup: "colored-toast",
            container: "swalContainer",
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true,
        });
        (async () => {
          await Toast.fire({
            icon: "error",
            title: error.response.data.message,
          });
        })();
      } else {
        console.log("ERROR!");
      }
    } finally {
      setLoading(false);
      onSubmit(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-40">
      <div
        className="bg-white shadow-md rounded-2xl"
        style={{ maxWidth: "100vh", minWidth: "1000px", maxHeight: "100vh" }}
      >
        <div className="flex p-5 bg-blue-500 rounded-tr-2xl rounded-tl-2xl max-h-max">
          <div className="flex-none">
            <img
              src={smct}
              alt="SMCT Logo"
              className="block h-24 m-0 w-60"
            ></img>
          </div>
          <div className="flex-none mt-4 ml-10 text-lg text-justify text-white">
            <p>
              <b>BRANCH CODE: </b>
              {viewPopupData.branch_code.branch_name}
            </p>
            <p>
              <b>NAME OF USER: </b>
              {viewPopupData.name}
            </p>
            <p>
              <b>DESIGNATION: </b>
              {viewPopupData.position.position_name}
            </p>
          </div>
          <div className="flex-1 text-3xl font-medium text-center text-white mt-7">
            <p>Computer ID: {id.length === 1 ? id : "-"}</p>
            <p className="text-base">
              Total Format:{" "}
              {fstatus[0] === 0
                ? "No formatting has been applied yet."
                : fstatus}
            </p>
          </div>
          <CloseIcon onClick={onClose} className="text-white cursor-pointer" />
        </div>
        <div
          className="mt-6 mb-4 ml-6 mr-6 overflow-y-scroll text-justify"
          style={{ height: "470px" }}
        >
          {showAlert && (
            <div
              className="relative px-4 py-5 mb-5 text-blue-800 bg-blue-100 border border-blue-400 rounded-md"
              role="alert"
            >
              <strong className="text-xl font-bold">
                Recommended Applications!
              </strong>
              <span className="block ml-5 sm:inline animate-bounce">
                <span className="px-5 py-2 font-bold border rounded-full animate-pulse bg-slate-100 hover:bg-slate-200">
                  Package
                </span>
                <span className="px-5 py-2 font-bold border rounded-full animate-pulse bg-slate-100 hover:bg-slate-200">
                  PDF Reader
                </span>
                <span className="px-5 py-2 font-bold border rounded-full animate-pulse bg-slate-100 hover:bg-slate-200">
                  Microsoft Office
                </span>
                <span className="px-5 py-2 font-bold border rounded-full animate-pulse bg-slate-100 hover:bg-slate-200">
                  SQL
                </span>
                <span className="px-5 py-2 font-bold border rounded-full animate-pulse bg-slate-100 hover:bg-slate-200">
                  Google Chrome
                </span>
                <span className="px-5 py-2 font-bold border rounded-full animate-pulse bg-slate-100 hover:bg-slate-200">
                  WinRAR
                </span>
                <span className="px-5 py-2 font-bold border rounded-full animate-pulse bg-slate-100 hover:bg-slate-200">
                  Anydesk
                </span>
              </span>
              <button
                className="absolute top-0 bottom-0 right-0 px-4 py-3 text-blue-500 hover:text-blue-700"
                onClick={dismissAlert}
              >
                <svg
                  className="w-6 h-6 fill-current"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M14.348 14.849a1 1 0 01-1.414 0L10 11.415l-2.934 2.934a1 1 0 01-1.414-1.414l2.934-2.934-2.934-2.934a1 1 0 011.414-1.414l2.934 2.934 2.934-2.934a1 1 0 011.414 1.414l-2.934 2.934 2.934 2.934a1 1 0 010 1.414z" />
                </svg>
              </button>
            </div>
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TableContainer component={Paper}>
                <Table {...getTableProps()}>
                  <TableHead>
                    {headerGroups.map((headerGroup) => (
                      <TableRow
                        className="bg-blue-300"
                        {...headerGroup.getHeaderGroupProps()}
                      >
                        {headerGroup.headers.map((column) => (
                          <TableCell
                            key={column.id}
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            align="center"
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
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
                        <TableCell>
                          <Typography
                            align="center"
                            variant="subtitle1"
                            fontWeight="bold"
                          >
                            RECENT USER
                          </Typography>
                        </TableCell>
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
                      tableRows.map((row) => {
                        prepareRow(row);
                        return (
                          <TableRow key={row.index} {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                              <TableCell
                                key={cell.column.id}
                                align="center"
                                {...cell.getCellProps()}
                              >
                                {cell.render("Cell")}
                              </TableCell>
                            ))}
                            <TableCell align="center">
                              <Typography
                                variant="subtitle1"
                                fontWeight="medium"
                              >
                                {viewPopupData.name}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                    {rows.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <p className="text-center">
                            This user has no computer units
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={6}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow className="bg-red-300">
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="bold">
                          DEVICE INFORMATION
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="bold">
                          DETAILS
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Installed Applications
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {Array.isArray(viewPopupData.computers) ? (
                          <div>
                            <ul>
                              {showAll
                                ? viewPopupData.computers.flatMap((item, idx) =>
                                    item.installed_applications.map((item) => (
                                      <li key={idx}>
                                        {item.application_content}
                                      </li>
                                    ))
                                  )
                                : viewPopupData.computers
                                    .slice(0, 3)
                                    .flatMap((item, idx) =>
                                      item.installed_applications.map(
                                        (item) => (
                                          <li key={idx}>
                                            {item.application_content}
                                          </li>
                                        )
                                      )
                                    )}
                            </ul>
                            {viewPopupData.computers.length > 3 && !showAll && (
                              <button onClick={handleViewMore}>
                                <u>View More</u>
                              </button>
                            )}
                          </div>
                        ) : (
                          <span>{viewPopupData.computers}</span>
                        )}
                        <p>
                          {viewPopupData.computers.flatMap((item, idx) =>
                            item.installed_applications.length === 0
                              ? "No installed applications yet."
                              : ""
                          )}
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Remarks
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {Array.isArray(viewPopupData.computers) ? (
                          <div>
                            <ul>
                              {showAll
                                ? viewPopupData.computers.flatMap((item, idx) =>
                                    item.remarks.map((item) => (
                                      <li key={idx}>{item.remark_content}</li>
                                    ))
                                  )
                                : viewPopupData.computers
                                    .slice(0, 3)
                                    .flatMap((item, idx) =>
                                      item.remarks.map((item) => (
                                        <li key={idx}>
                                          <div className="p-2 mb-1 border rounded-lg">
                                            <div>
                                              {format(
                                                new Date(item.date),
                                                "MMMM dd, yyyy"
                                              )}
                                            </div>
                                            {item.remark_content
                                              .split("\n")
                                              .map((line, lineIndex) => (
                                                <div key={lineIndex}>
                                                  {line}
                                                </div>
                                              ))}
                                          </div>
                                        </li>
                                      ))
                                    )}
                            </ul>
                            {viewPopupData.computers.length > 3 && !showAll && (
                              <button onClick={handleViewMore}>
                                <u>View More</u>
                              </button>
                            )}
                          </div>
                        ) : (
                          <span>{viewPopupData.computers}</span>
                        )}
                        <p>
                          {viewPopupData.computers.flatMap((item, idx) =>
                            item.remarks.length === 0 ? "No remarks yet." : ""
                          )}
                        </p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </div>
        <div className="flex items-center justify-center pt-10 pb-10 text-center">
          <button
            className="mr-16 text-xl text-black bg-gray-300 rounded-3xl h-9 w-36"
            onClick={handleClickOpen}
          >
            EDIT
          </button>
          <button
            disabled={id.length === 0}
            className={
              id.length === 0
                ? "text-xl text-white bg-blue-300 cursor-not-allowed rounded-3xl h-9 w-36"
                : "text-xl text-white bg-blue-500 rounded-3xl h-9 w-36"
            }
            onClick={handleClick}
          >
            PRINT
          </button>
          {/* The next div is for printing and hidden */}
          <div className="hidden">
            <PrintInformation />
          </div>
          <form onSubmit={handleSubmit}>
            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
            >
              <DialogTitle
                sx={{ m: 0, p: 2 }}
                id="customized-dialog-title"
                className="text-white bg-blue-500"
              >
                EDIT COMPUTER ID. {id.length === 1 ? id : ""}
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: "white",
                }}
              >
                <CloseIcon />
              </IconButton>
              <DialogContent dividers>
                <TextField
                  id="outlined-read-only-input"
                  label="Name of User"
                  defaultValue={viewPopupData.name}
                  InputProps={{
                    readOnly: true,
                  }}
                  style={{ marginBottom: "10px", width: "100%" }}
                />
                <TextField
                  id="outlined-read-only-input"
                  label="User Email"
                  defaultValue={viewPopupData.email}
                  style={{ width: "100%" }}
                  onChange={handleEmailChange}
                />
                {validationErrors.email ? (
                  <span className="text-red-500">
                    {validationErrors.email.map((error, index) => (
                      <span key={index}>{error}</span>
                    ))}
                  </span>
                ) : (
                  ""
                )}
                <Autocomplete
                  id="branch-code"
                  freeSolo
                  defaultValue={viewPopupData.branch_code.branch_name}
                  readOnly={Branchcode.length === 0}
                  options={Branchcode} //Sample
                  getOptionLabel={(option) =>
                    option.branch_name ? option.branch_name : ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        Branchcode.length === 0
                          ? "No branchcode added yet"
                          : "Branchcode"
                      }
                      style={{ marginBottom: "10px", marginTop: "10px" }}
                    />
                  )}
                  value={
                    Branchcode.find(
                      (option) => option.id === user.branch_code
                    ) || {}
                  }
                  onChange={handleBranchCodeChange}
                />
                {validationErrors.branch_code ? (
                  <span className="text-red-500">
                    {validationErrors.branch_code.map((error, index) => (
                      <span key={index}>{error}</span>
                    ))}
                  </span>
                ) : (
                  ""
                )}
                <Autocomplete
                  id="designation"
                  freeSolo
                  defaultValue={viewPopupData.position.position_name}
                  options={Position}
                  readOnly={Position.length === 0}
                  getOptionLabel={(option) =>
                    option.position_name ? option.position_name : ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        Position.length === 0
                          ? "No position added yet"
                          : "Position"
                      }
                      style={{ marginBottom: "10px" }}
                    />
                  )}
                  value={
                    Position.find((option) => option.id === user.position) || {}
                  }
                  onChange={handlePositionChange}
                />
                {validationErrors.position ? (
                  <span className="text-red-500">
                    {validationErrors.position.map((error, index) => (
                      <span key={index}>{error}</span>
                    ))}
                  </span>
                ) : (
                  ""
                )}
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={[
                    "Package",
                    "SQL",
                    "Anydesk",
                    "WinRAR",
                    "LAN Messenger",
                    "Adobe Acrobat Reader",
                    "Adobe Photoshop",
                    "Microsoft Office",
                    "Google Chrome",
                    "Mozilla Firefox",
                  ]}
                  freeSolo
                  value={applicationContent}
                  onChange={handleApplications}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Installed Applications"
                      placeholder="Installed Applications"
                    />
                  )}
                />
                {validationErrors.application_content ? (
                  <span className="text-red-500">
                    {validationErrors.application_content.map(
                      (error, index) => (
                        <span key={index}>{error}</span>
                      )
                    )}
                  </span>
                ) : (
                  ""
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  autoFocus
                  type="submit"
                  onClick={handleSubmit}
                  variant="contained"
                  color="success"
                  style={{ margin: "10px" }}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </DialogActions>
            </BootstrapDialog>
          </form>
        </div>
      </div>
    </div>
  );
}

export default View;
