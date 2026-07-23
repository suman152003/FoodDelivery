import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DataTableModule from "react-data-table-component";

const DataTable = DataTableModule.default || DataTableModule;

import Loader from "../layout/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";

import {
  getAllOrdersAdmin,
  updateOrderStatus,
} from "../../redux/actions/orderActions";
import { clearErrors } from "../../redux/slices/orderSlice";

const STATUS_OPTIONS = [
  "Processing",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const AdminOrders = () => {
  const dispatch = useDispatch();

  const { loading, error, allOrders, totalAmount, updateError } =
    useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrdersAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }
  }, [error, updateError, dispatch]);

  const statusChangeHandler = (id, orderStatus) => {
    dispatch(updateOrderStatus(id, orderStatus)).then(() => {
      toast.success("Order status updated");
    });
  };

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row.id,
      sortable: true,
      grow: 2,
    },
    {
      name: "Customer",
      selector: (row) => row.customer,
      sortable: true,
    },
    {
      name: "Restaurant",
      selector: (row) => row.restaurant,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <select
          className="form-control form-control-sm"
          value={row.status}
          onChange={(e) => statusChangeHandler(row.id, e.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ),
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/eats/orders/${row.id}`} className="btn btn-primary btn-sm">
          View
        </Link>
      ),
    },
  ];

  const data =
    allOrders?.map((order) => ({
      id: order._id,
      customer: order.user?.name || "Unknown",
      restaurant: order.restaurant?.name || "Unknown",
      amount: `₹${order.finalTotal}`,
      status: order.orderStatus,
      date: new Date(order.createdAt).toLocaleDateString(),
    })) || [];

  return (
    <div className="list-orders-container">
      <h1 className="orders-title">All Orders (Admin)</h1>

      <p className="mb-3">
        <b>Total Revenue: </b>
        <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
        {totalAmount?.toFixed(2)}
      </p>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          striped
          responsive
        />
      )}
    </div>
  );
};

export default AdminOrders;
