import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Modal,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import Select from "react-select";
import axios from "../../api/axios";
import { format } from "date-fns";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DatePicker from "react-datepicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faEdit,
  faX,
  faFloppyDisk,
  faSpinner,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

function EditSet({
  isOpen,
  onClose,
  editPopupData,
  setEditPopupData,
  onSubmit,
}) {
  const [computerUser, setComputerUser] = useState({ data: [] });
  const [computer, setComputer] = useState({
    computer_user: "",
  });
  const [loading, setLoading] = useState(true);
  const [computerName, setComputerName] = useState("");
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [transferDate, setTransferDate] = useState(null);
  const [sloading, setsLoading] = useState(false);
  const [error, setError] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [checkedRows, setCheckedRows] = useState([]);
  const [computerId, setComputerId] = useState("");
  const [unit, setUnit] = useState([]);
  const [markedLoading, setMarkedLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editUnitId, setEditUnitId] = useState(null);
  const [category, setCategory] = useState({ data: [] });
  const [supplier, setSupplier] = useState({ data: [] });
  const [editValues, setEditValues] = useState({
    date_of_purchase: "",
    category: "",
    description: "",
    supplier: "",
    serial_number: "",
    status: "",
  });
  const options = [
    { value: "Used", label: "Used" },
    { value: "Defective", label: "Defective" },
  ];
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCheckboxClick = (unitId) => {
    if (checkedRows.includes(unitId)) {
      setCheckedRows(checkedRows.filter((id) => id !== unitId));
    } else {
      setCheckedRows([...checkedRows, unitId]);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (Array.isArray(editPopupData.computers)) {
          const allUnits = editPopupData.computers.flatMap((computer) =>
            computer.units.map((unit) => ({
              ...unit,
              computerName: computer.name,
            }))
          );
          setUnit(allUnits);
          const name = editPopupData.name;
          const id = editPopupData.computers.map((computer) => computer.id);
          setComputerName(name);
          setComputerId(id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchComputerUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/computer-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComputerUser(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchComputerUser();
  }, []);

  const ComputerUser =
    computerUser.data && computerUser.data.length > 0
      ? computerUser.data
          .filter((cu) => cu.id !== editPopupData.id)
          .map((cu) => ({
            id: cu.id,
            name: cu.name,
          }))
      : [];

  const handleUpdateUnit = (id, data) => {
    setEditUnitId(id);
    setEditValues({
      ...editValues,
      date_of_purchase: data.date_of_purchase,
      category: {
        label: data.category.category_name,
        value: data.category.id,
      },
      description: data.description,
      supplier: {
        label: data.supplier.supplier_name,
        value: data.supplier.id,
      },
      serial_number: data.serial_number,
      status: { label: data.status, value: data.status },
    });
    setValidationErrors({});
  };

  const formatEditValues = (values) => ({
    date_of_purchase: values.date_of_purchase,
    category: values.category.value,
    description: values.description,
    supplier: values.supplier.value,
    serial_number: values.serial_number,
    status: values.status.value,
  });

  const handleEditDateChange = (date) => {
    setEditValues({
      ...editValues,
      date_of_purchase: date,
    });
  };

  const handleSelectChange = (selectedOption, field) => {
    setEditValues({
      ...editValues,
      [field]: selectedOption,
    });
  };
  const handleSaveUnit = async (id) => {
    setLoadingUpdate(true);
    onSubmit(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const formattedValues = formatEditValues(editValues);

      const response = await axios.post(
        `/api/update-unit/${id}`,
        formattedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "green",
          customClass: {
            popup: "colored-toast",
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

        handleCancelEdit();
      }
    } catch (error) {
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
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoadingUpdate(false);
      onSubmit(false);
      onClose();
    }
  };

  const handleCancelEdit = () => {
    setEditUnitId(null);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategory(response?.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchCategory();
  }, []);
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get("/api/suppliers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSupplier(response?.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchSupplier();
  }, []);

  const Category = category.data?.map((cat) => ({
    label: cat.category_name,
    value: cat.id,
  }));

  const Supplier = supplier.data?.map((sup) => ({
    label: sup.supplier_name,
    value: sup.id,
  }));

  if (!isOpen) {
    return null;
  }

  const handleSubmitEditedSet = async (e) => {
    e.preventDefault();
    setsLoading(true);
    onSubmit(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      let transferCount = 0;
      let defectiveCount = 0;
      let deleteCount = 0;

      let allSuccess = true;
      const successMessages = [];

      for (const unitId of checkedRows) {
        const response = await axios.post(
          `/api/computer/${computerId}/unit/${unitId}/action`,
          {
            action: reason,
            computer_user: computer.computer_user,
            date: transferDate || null,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status !== true) {
          allSuccess = false;
          console.log("Operation failed for unit:", unitId);
        } else {
          switch (reason) {
            case "Transfer":
              transferCount++;
              successMessages.push(`Transferred unit ${unitId}`);
              break;
            case "Defective":
              defectiveCount++;
              successMessages.push(`Marked unit ${unitId} as defective`);
              break;
            case "Delete":
              deleteCount++;
              successMessages.push(`Deleted unit ${unitId}`);
              break;
            default:
              break;
          }
        }

        console.log("Processed unit:", unitId, response.data);
      }

      if (allSuccess && successMessages.length > 0) {
        const updatedResponse = await axios.get(
          `/api/computer-user-edit/${editPopupData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEditPopupData(updatedResponse.data.computer_user_data);
        setCheckedRows([]);
        setTransferDate(null);
        setReason("");
        setComputer([]);
        if (updatedResponse.data.computer_user_data.computers.length === 0) {
          onClose();
        } else {
          setOpen(false);
        }
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
          timer: 3000,
          timerProgressBar: true,
        });

        await Toast.fire({
          icon: "success",
          title: `Successfully processed: ${successMessages.length} unit(s)`,
          html: `
            <ul>
              ${
                transferCount > 0 ? `<li>${transferCount} transferred</li>` : ""
              }
              ${
                defectiveCount > 0
                  ? `<li>${defectiveCount} marked defective</li>`
                  : ""
              }
              ${deleteCount > 0 ? `<li>${deleteCount} deleted</li>` : ""}
            </ul>
          `,
        });
      }
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

        await Toast.fire({
          icon: "error",
          title: error.response.data.message,
        });
      } else {
        console.log("ERROR!");
      }
    } finally {
      setsLoading(false);
      onSubmit(false);
    }
  };

  const handleDateChange = (newDate) => {
    setTransferDate(dayjs(newDate).format("YYYY-MM-DD"));
  };

  const handleMarkedAsClean = async (e) => {
    e.preventDefault();
    setMarkedLoading(true);
    onSubmit(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.post(
        `/api/cleaning-complete/${computerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === true) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "green",
          customClass: {
            popup: "colored-toast",
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
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);

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

        await Toast.fire({
          icon: "error",
          title: error.response.data.message,
        });
      } else {
        console.log("ERROR!");
      }
    } finally {
      setMarkedLoading(false);
      onSubmit(false);
      onClose();
    }
  };

  const sortRows = (rows) => {
    return rows.sort((a, b) => {
      let valueA, valueB;

      if (sortColumn === "unit_code") {
        valueA = a.unit_code;
        valueB = b.unit_code;
      } else if (sortColumn === "date_of_purchase") {
        valueA = a.date_of_purchase;
        valueB = b.date_of_purchase;
      } else if (sortColumn === "description") {
        valueA = a.description.toLowerCase();
        valueB = b.description.toLowerCase();
      } else if (sortColumn === "supplier.supplier_name") {
        valueA = a.supplier.supplier_name.toLowerCase();
        valueB = b.supplier.supplier_name.toLowerCase();
      } else if (sortColumn === "category.category_name") {
        valueA = a.category.category_name.toLowerCase();
        valueB = b.category.category_name.toLowerCase();
      } else if (sortColumn === "serial_number") {
        valueA = a.serial_number.toLowerCase();
        valueB = b.serial_number.toLowerCase();
      } else if (sortColumn === "status") {
        valueA = a.status.toLowerCase();
        valueB = b.status.toLowerCase();
      }

      if (sortOrder === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  };

  const handleSort = (column) => {
    const isAscending = sortColumn === column && sortOrder === "asc";
    setSortColumn(column);
    setSortOrder(isAscending ? "desc" : "asc");
  };
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-40">
        <div
          className="bg-white shadow-md rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-xl"
          style={{
            minWidth: "90%",
            maxWidth: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            margin: "0 auto",
          }}
        >
          <div className="max-h-screen overflow-y-auto text-justify">
            <TableContainer
              component={Paper}
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow className="bg-red-200">
                    <TableCell
                      className="cursor-pointer"
                      align="center"
                      onClick={() => handleSort("unit_code")}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: 700 }}
                      >
                        UNIT CODE{" "}
                        {sortColumn === "unit_code" &&
                          (sortOrder === "asc" ? (
                            <FontAwesomeIcon icon={faArrowDown} />
                          ) : (
                            <FontAwesomeIcon icon={faArrowUp} />
                          ))}
                      </Typography>
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      align="center"
                      onClick={() => handleSort("date_of_purchase")}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: 700 }}
                      >
                        DATE OF PURCHASE{" "}
                        {sortColumn === "date_of_purchase" &&
                          (sortOrder === "asc" ? (
                            <FontAwesomeIcon icon={faArrowDown} />
                          ) : (
                            <FontAwesomeIcon icon={faArrowUp} />
                          ))}
                      </Typography>
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      align="center"
                      onClick={() => handleSort("category.category_name")}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: 700 }}
                      >
                        CATEGORY{" "}
                        {sortColumn === "category.category_name" &&
                          (sortOrder === "asc" ? (
                            <FontAwesomeIcon icon={faArrowDown} />
                          ) : (
                            <FontAwesomeIcon icon={faArrowUp} />
                          ))}
                      </Typography>
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      align="center"
                      onClick={() => handleSort("description")}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: 700 }}
                      >
                        DESCRIPTION{" "}
                        {sortColumn === "description" &&
                          (sortOrder === "asc" ? (
                            <FontAwesomeIcon icon={faArrowDown} />
                          ) : (
                            <FontAwesomeIcon icon={faArrowUp} />
                          ))}
                      </Typography>
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      align="center"
                      onClick={() => handleSort("supplier.supplier_name")}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: 700 }}
                      >
                        SUPPLIER{" "}
                        {sortColumn === "supplier.supplier_name" &&
                          (sortOrder === "asc" ? (
                            <FontAwesomeIcon icon={faArrowDown} />
                          ) : (
                            <FontAwesomeIcon icon={faArrowUp} />
                          ))}
                      </Typography>
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      align="center"
                      onClick={() => handleSort("serial_number")}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: 700 }}
                      >
                        SERIAL NO.{" "}
                        {sortColumn === "serial_number" &&
                          (sortOrder === "asc" ? (
                            <FontAwesomeIcon icon={faArrowDown} />
                          ) : (
                            <FontAwesomeIcon icon={faArrowUp} />
                          ))}
                      </Typography>
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      align="center"
                      onClick={() => handleSort("status")}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: 700 }}
                      >
                        STATUS{" "}
                        {sortColumn === "status" &&
                          (sortOrder === "asc" ? (
                            <FontAwesomeIcon icon={faArrowDown} />
                          ) : (
                            <FontAwesomeIcon icon={faArrowUp} />
                          ))}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: 700 }}
                      >
                        ACTION
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8}>
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
                    sortRows(unit).map((unit, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{unit.unit_code}</TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.id ? (
                            <>
                              <DatePicker
                                selected={editValues?.date_of_purchase}
                                onChange={handleEditDateChange}
                                placeholderText=""
                                dateFormat={"yyyy-MM-dd"}
                                className={
                                  editUnitId === unit.id &&
                                  validationErrors["date_of_purchase"]
                                    ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 h-9 pl-2"
                                    : "bg-gray-200 border border-transparent rounded-xl w-4/4 h-9 pl-2"
                                }
                              />
                            </>
                          ) : (
                            <>
                              {format(
                                new Date(unit.date_of_purchase),
                                "yyyy-MM-dd"
                              )}
                            </>
                          )}
                          <span className="text-sm text-center">
                            {editUnitId === unit.id &&
                              validationErrors["date_of_purchase"] && (
                                <div className="text-sm text-center text-red-500">
                                  {validationErrors["date_of_purchase"].map(
                                    (error, errorIndex) => (
                                      <span key={errorIndex}>{error}</span>
                                    )
                                  )}
                                </div>
                              )}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.id ? (
                            <Select
                              options={Category}
                              value={editValues?.category}
                              onChange={(e) =>
                                handleSelectChange(e, "category")
                              }
                              placeholder={
                                editValues?.category ? "" : "Select Category"
                              }
                              className={
                                editUnitId === unit.id &&
                                validationErrors["category"]
                                  ? "border border-red-500"
                                  : "border border-transparent"
                              }
                            />
                          ) : unit.category ? (
                            unit.category.category_name
                          ) : (
                            "N/A"
                          )}
                          <span className="text-sm text-center">
                            {editUnitId === unit.id &&
                              validationErrors["category"] && (
                                <div className="text-sm text-center text-red-500">
                                  {validationErrors["category"].map(
                                    (error, errorIndex) => (
                                      <span key={errorIndex}>{error}</span>
                                    )
                                  )}
                                </div>
                              )}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.id ? (
                            <textarea
                              rows={3}
                              type="text"
                              value={editValues?.description || ""}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  description: e.target.value,
                                })
                              }
                              className={
                                editUnitId === unit.id &&
                                validationErrors["description"]
                                  ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 pl-2"
                                  : "bg-gray-200 border border-transparent rounded-xl w-4/4 pl-2"
                              }
                            />
                          ) : (
                            unit?.description
                              .split("\n")
                              .map((line, lineIndex) => (
                                <div key={lineIndex}>{line}</div>
                              ))
                          )}
                          <span className="text-sm text-center">
                            {editUnitId === unit.id &&
                              validationErrors["description"] && (
                                <div className="text-sm text-center text-red-500">
                                  {validationErrors["description"].map(
                                    (error, errorIndex) => (
                                      <span key={errorIndex}>{error}</span>
                                    )
                                  )}
                                </div>
                              )}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.id ? (
                            <Select
                              options={Supplier}
                              value={editValues?.supplier}
                              onChange={(e) =>
                                handleSelectChange(e, "supplier")
                              }
                              placeholder={
                                editValues?.supplier ? "" : "Select Supplier"
                              }
                              className={
                                editUnitId === unit.id &&
                                validationErrors["supplier"]
                                  ? "border border-red-500"
                                  : "border border-transparent"
                              }
                            />
                          ) : unit.supplier ? (
                            unit.supplier.supplier_name
                          ) : (
                            "N/A"
                          )}
                          <span className="text-sm text-center">
                            {editUnitId === unit.id &&
                              validationErrors["supplier"] && (
                                <div className="text-sm text-center text-red-500">
                                  {validationErrors["supplier"].map(
                                    (error, errorIndex) => (
                                      <span key={errorIndex}>{error}</span>
                                    )
                                  )}
                                </div>
                              )}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.id ? (
                            <input
                              type="text"
                              value={editValues?.serial_number || null}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  serial_number: e.target.value,
                                })
                              }
                              placeholder=""
                              className={
                                editUnitId === unit.id &&
                                validationErrors["serial_number"]
                                  ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 h-9 pl-2"
                                  : "bg-gray-200 border border-transparent rounded-xl w-4/4 h-9 pl-2"
                              }
                            />
                          ) : (
                            unit.serial_number
                          )}
                          <span className="text-sm text-center">
                            {editUnitId === unit.id &&
                              validationErrors["serial_number"] && (
                                <div className="text-sm text-center text-red-500">
                                  {validationErrors["serial_number"].map(
                                    (error, errorIndex) => (
                                      <span key={errorIndex}>{error}</span>
                                    )
                                  )}
                                </div>
                              )}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.id ? (
                            <Select
                              options={options}
                              value={editValues?.status || null}
                              onChange={(e) => handleSelectChange(e, "status")}
                              placeholder={
                                editValues?.status ? "" : "Select status"
                              }
                              className={
                                editUnitId === unit.id &&
                                validationErrors["status"]
                                  ? "border border-red-500"
                                  : "border border-transparent"
                              }
                            />
                          ) : (
                            unit.status
                          )}
                          <span className="text-sm text-center">
                            {editUnitId === unit.id &&
                              validationErrors["status"] && (
                                <div className="text-sm text-center text-red-500">
                                  {validationErrors["status"].map(
                                    (error, errorIndex) => (
                                      <span key={errorIndex}>{error}</span>
                                    )
                                  )}
                                </div>
                              )}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          {editUnitId === unit.id ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "0.25rem",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => handleSaveUnit(unit.id)}
                                style={{
                                  padding: "0.5rem 1rem",
                                  fontWeight: "600",
                                  color: "white",
                                  background:
                                    "linear-gradient(to right, #48C774, #1E90FF)",
                                  borderRadius: "0.375rem",
                                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                  transition:
                                    "background-color 0.3s ease, transform 0.3s ease",
                                  outline: "none",
                                }}
                                onMouseOver={(e) =>
                                  (e.currentTarget.style.background =
                                    "linear-gradient(to right, #36D759, #1C86EE)")
                                }
                                onMouseOut={(e) =>
                                  (e.currentTarget.style.background =
                                    "linear-gradient(to right, #48C774, #1E90FF)")
                                }
                              >
                                {loadingUpdate ? (
                                  <FontAwesomeIcon
                                    className="animate-spin"
                                    icon={faSpinner}
                                  />
                                ) : (
                                  <FontAwesomeIcon icon={faFloppyDisk} />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                style={{
                                  padding: "0.5rem 1rem",
                                  fontWeight: "600",
                                  color: "white",
                                  background:
                                    "linear-gradient(to right, #FF4D4D, #FF007F)",
                                  borderRadius: "0.375rem",
                                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                  transition:
                                    "background-color 0.3s ease, transform 0.3s ease",
                                  outline: "none",
                                }}
                                onMouseOver={(e) =>
                                  (e.currentTarget.style.background =
                                    "linear-gradient(to right, #FF3B3B, #FF0055)")
                                }
                                onMouseOut={(e) =>
                                  (e.currentTarget.style.background =
                                    "linear-gradient(to right, #FF4D4D, #FF007F)")
                                }
                              >
                                <FontAwesomeIcon icon={faX} />
                              </button>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "0.25rem",
                              }}
                            >
                              <Checkbox
                                checked={checkedRows.includes(unit.id)}
                                onChange={() => handleCheckboxClick(unit.id)}
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdateUnit(unit.id, unit)}
                                style={{
                                  padding: "0.5rem 1rem",
                                  fontWeight: "600",
                                  color: "white",
                                  background:
                                    "linear-gradient(to right, #1E90FF, #1E90FE)",
                                  borderRadius: "0.375rem",
                                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                  transition:
                                    "background-color 0.3s ease, transform 0.3s ease",
                                  outline: "none",
                                }}
                                onMouseOver={(e) =>
                                  (e.currentTarget.style.background =
                                    "linear-gradient(to right, #1C86EE, #1E90FE)")
                                }
                                onMouseOut={(e) =>
                                  (e.currentTarget.style.background =
                                    "linear-gradient(to right, #1E90FF, #1E90FE)")
                                }
                              >
                                <FontAwesomeIcon icon={faPen} />
                              </button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="flex items-center justify-center">
              <p className="p-5 text-xl text-center">
                <strong>{computerName}&apos;s</strong> Computer
              </p>
              <div className="items-end justify-end flex-1 ml-48 text-center">
                <button
                  type="button"
                  className="w-24 h-8 text-sm font-semibold bg-gray-200 rounded-full"
                  onClick={onClose}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleOpen}
                  className={
                    checkedRows.length === 0
                      ? "w-24 h-8 ml-3 text-sm font-semibold text-white bg-blue-300 rounded-full cursor-not-allowed"
                      : "w-24 h-8 ml-3 text-sm font-semibold text-white bg-blue-600 rounded-full"
                  }
                  disabled={checkedRows.length === 0}
                >
                  {checkedRows.length === 0 ? "UPDATE" : "UPDATE"}
                </button>
                <button
                  type="button"
                  disabled={markedLoading}
                  onClick={handleMarkedAsClean}
                  className={
                    markedLoading
                      ? "h-8 ml-3 text-sm font-semibold text-white bg-green-400 rounded-full w-28 cursor-not-allowed"
                      : "h-8 ml-3 text-sm font-semibold text-white bg-green-600 rounded-full w-28"
                  }
                >
                  {markedLoading ? "Cleaning" : "Mark As Clean"}
                </button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <form onSubmit={handleSubmitEditedSet}>
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        Why did you update this unit?
                      </Typography>
                      <Box sx={{ minWidth: 120, marginTop: 2 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            State the reason for the action...
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={reason}
                            label="State the reason for the action..."
                            onChange={(e) => {
                              setReason(e.target.value);
                              setValidationErrors("");
                            }}
                          >
                            <MenuItem value="Transfer">Transfer</MenuItem>
                            <MenuItem value="Defective">Defective</MenuItem>
                            <MenuItem value="Delete">Remove Unit</MenuItem>
                          </Select>
                        </FormControl>
                        <span className="mb-2">
                          {validationErrors.action && (
                            <div className="text-red-500">
                              <ul>
                                {validationErrors.action.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </span>
                      </Box>
                      {reason === "Transfer" && (
                        <Box style={{ marginTop: "10px" }}>
                          <Autocomplete
                            freeSolo
                            id="user"
                            disableClearable
                            options={ComputerUser}
                            getOptionLabel={(option) =>
                              option.name ? option.name : ""
                            }
                            readOnly={ComputerUser.length === 0}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={
                                  ComputerUser.length === 0
                                    ? "No user to select"
                                    : "Assign New User"
                                }
                                InputProps={{
                                  ...params.InputProps,
                                  type: "search",
                                }}
                                variant="outlined"
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                  marginRight: "400px",
                                }}
                                sx={{ minWidth: 120 }}
                              />
                            )}
                            value={
                              ComputerUser.find(
                                (option) => option.id === computer.computer_user
                              ) || {}
                            }
                            onChange={(event, newValue) => {
                              setComputer({
                                ...computer,
                                computer_user: newValue.id,
                              });
                            }}
                          />
                          <span className="mb-2">
                            {validationErrors.computer_user && (
                              <div className="text-red-500">
                                <ul>
                                  {validationErrors.computer_user.map(
                                    (error, index) => (
                                      <li key={index}>{error}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </span>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                              <DatePicker
                                label="Date of Transfer"
                                value={
                                  transferDate ? dayjs(transferDate) : null
                                }
                                onChange={handleDateChange}
                                format="YYYY-MM-DD"
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                          <span className="mb-2">
                            {validationErrors.date && (
                              <div className="text-red-500">
                                <ul>
                                  {validationErrors.date.map((error, index) => (
                                    <li key={index}>{error}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </span>
                        </Box>
                      )}
                      <Grid className="mt-5">
                        <Button
                          type="button"
                          onClick={handleClose}
                          variant="contained"
                          style={{
                            backgroundColor: "gray",
                            marginRight: "10px",
                          }}
                        >
                          CANCEL
                        </Button>
                        <Button
                          type="submit"
                          disabled={sloading}
                          variant="contained"
                          color="success"
                        >
                          {sloading ? "SAVING..." : "SAVE"}
                        </Button>
                      </Grid>
                    </Box>
                  </form>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditSet;
