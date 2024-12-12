import React, { useState, useEffect } from "react";

const CustomerManagement = () => {
  // States for storing customer data, form inputs, loading states, and errors
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gstin: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch customers from the API
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
          const response = await fetch("http://127.0.0.1:8000/api/customer/", {
          method: "GET",
          credentials: "include", // If authentication or cookies are required
        });
        const data = await response.json();
        if (response.ok) {
          setCustomers(data.customers); // assuming the response contains an array of customers
        } else {
          throw new Error("Failed to fetch customers.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers(); // Call the function when the component mounts
  }, []);

  // Handle input changes for adding a new customer
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value,
    });
  };

  // Handle form submission to add a new customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/customer/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
        credentials: "include", // If authentication or cookies are required
      });

      const data = await response.json();
      if (response.ok) {
        // On success, add the new customer to the table (optimistic update)
        setCustomers([...customers, newCustomer]);
        setNewCustomer({ name: "", phone: "", email: "", address: "", gstin: "" }); // Reset the form
      } else {
        throw new Error(data.message || "Failed to add customer.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Customer Management</h1>

      {/* Error message */}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Add New Customer Form */}
      <h2>Add New Customer</h2>
      <form onSubmit={handleAddCustomer}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newCustomer.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={newCustomer.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={newCustomer.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={newCustomer.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>GSTIN:</label>
          <input
            type="text"
            name="gstin"
            value={newCustomer.gstin}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Customer"}
        </button>
      </form>

      {/* Customers Table */}
      <h2>Existing Customers</h2>
      {loading && <div>Loading...</div>}
      {!loading && customers.length === 0 && <div>No customers found.</div>}
      {!loading && customers.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>GSTIN</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.address}</td>
                <td>{customer.gstin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerManagement;
