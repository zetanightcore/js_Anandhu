import React, { useState, useEffect } from "react";
import "./CustomerManagement.css";

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [newCustomer, setNewCustomer] = useState({
        name: "",
        address: "",
        phone: "",
        email_id: "",
        category: "",
        GSTIN: "",
        password: "",
        otp: "",
        sales_rank: "",
        created_on: "",
        created_by: "",
        last_updated_on: "",
        last_updated_by: "",
        client_id: "",
    });

    // Fetch customers on component load or search query change
    useEffect(() => {
        fetchCustomers();
    }, []); // You can add searchQuery here to fetch customers on query change

    const fetchCustomers = async (query = "") => {
        try {
            const url = new URL("http://127.0.0.1:8000/api/customer/");
            if (query) url.searchParams.append("search", query);

            const response = await fetch(url, { method: "GET", credentials: "include" });
            const data = await response.json();

            console.log("Response Data:", data); // Log response to inspect
            if (response.ok) {
                setCustomers(data.customers || []);
            } else {
                console.error("Error fetching customers:", data);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const handleSearch = () => {
        fetchCustomers(searchQuery);
    };

    const handleAddCustomer = async () => {
        try {
            // Validate required fields
            if (!newCustomer.name || !newCustomer.phone || !newCustomer.email_id) {
                alert("Name, Phone, and Email are required!");
                return;
            }

            const response = await fetch("http://127.0.0.1:8000/api/customer/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCustomer),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                alert("Customer added successfully!");
                // Reset the form after successful addition
                setNewCustomer({
                    name: "",
                    address: "",
                    phone: "",
                    email_id: "",
                    category: "",
                    GSTIN: "",
                    password: "",
                    otp: "",
                    sales_rank: "",
                    created_on: "",
                    created_by: "",
                    last_updated_on: "",
                    last_updated_by: "",
                    client_id: "",
                });
                fetchCustomers(); // Refresh customer list
            } else {
                alert(data.message || "Failed to add customer");
                console.error("Failed to add customer:", data);
            }
        } catch (error) {
            console.error("Error adding customer:", error);
            alert("An error occurred while adding the customer. Please try again.");
        }
    };

    const handleDeleteCustomer = async (customerId) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/customer/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customer_id: customerId }),
                credentials: "include",
            });

            if (response.ok) {
                alert("Customer deleted successfully!");
                fetchCustomers(); // Refresh customer list
            } else {
                console.error("Failed to delete customer");
            }
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };

    const handleSaveCustomer = async (customer) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/customer/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customer),
                credentials: "include",
            });

            if (response.ok) {
                alert("Customer updated successfully!");
                fetchCustomers(); // Refresh customer list
            } else {
                console.error("Failed to update customer");
            }
        } catch (error) {
            console.error("Error updating customer:", error);
        }
    };

    const handleEditCustomer = (customerId) => {
        setCustomers(customers.map((customer) =>
            customer.customer_id === customerId ? { ...customer, isEditing: true } : customer
        ));
    };

    const handleCancelEdit = (customerId) => {
        setCustomers(customers.map((customer) =>
            customer.customer_id === customerId ? { ...customer, isEditing: false } : customer
        ));
    };

    const handleInputChange = (e, customerId, field) => {
        const updatedCustomers = customers.map((customer) =>
            customer.customer_id === customerId
                ? { ...customer, [field]: e.target.value }
                : customer
        );
        setCustomers(updatedCustomers);
    };

    return (
        <div className="customer-management">
            <h1>Customer Management</h1>

            {/* Search Bar */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search customers"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Add New Customer */}
            <div className="add-customer-section">
                <h2>Add Customer</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newCustomer.email_id}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email_id: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={newCustomer.category}
                    onChange={(e) => setNewCustomer({ ...newCustomer, category: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="GSTIN"
                    value={newCustomer.GSTIN}
                    onChange={(e) => setNewCustomer({ ...newCustomer, GSTIN: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newCustomer.password}
                    onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="OTP"
                    value={newCustomer.otp}
                    onChange={(e) => setNewCustomer({ ...newCustomer, otp: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Sales Rank"
                    value={newCustomer.sales_rank}
                    onChange={(e) => setNewCustomer({ ...newCustomer, sales_rank: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Created On"
                    value={newCustomer.created_on}
                    onChange={(e) => setNewCustomer({ ...newCustomer, created_on: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Created By"
                    value={newCustomer.created_by}
                    onChange={(e) => setNewCustomer({ ...newCustomer, created_by: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Last Updated On"
                    value={newCustomer.last_updated_on}
                    onChange={(e) => setNewCustomer({ ...newCustomer, last_updated_on: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Last Updated By"
                    value={newCustomer.last_updated_by}
                    onChange={(e) => setNewCustomer({ ...newCustomer, last_updated_by: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Client ID"
                    value={newCustomer.client_id}
                    onChange={(e) => setNewCustomer({ ...newCustomer, client_id: e.target.value })}
                />
                <button onClick={handleAddCustomer}>Add Customer</button>
            </div>

            {/* Customer List */}
            <div className="customer-list-section">
                <h2>Customer List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Category</th>
                            <th>GSTIN</th>
                            <th>Password</th>
                            <th>OTP</th>
                            <th>Sales Rank</th>
                            <th>Created On</th>
                            <th>Created By</th>
                            <th>Last Updated On</th>
                            <th>Last Updated By</th>
                            <th>Client ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.customer_id}>
                                <td>{customer.name}</td>
                                <td>{customer.address}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.email_id}</td>
                                <td>{customer.category}</td>
                                <td>{customer.GSTIN}</td>
                                <td>{customer.password}</td>
                                <td>{customer.otp}</td>
                                <td>{customer.sales_rank}</td>
                                <td>{customer.created_on}</td>
                                <td>{customer.created_by}</td>
                                <td>{customer.last_updated_on}</td>
                                <td>{customer.last_updated_by}</td>
                                <td>{customer.client_id}</td>
                                <td>
                                    <button onClick={() => handleEditCustomer(customer.customer_id)}>Edit</button>
                                    <button onClick={() => handleDeleteCustomer(customer.customer_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerManagement;
