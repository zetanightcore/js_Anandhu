import React, { useState, useEffect } from 'react';

const ProductManagement = () => {
    // State hooks for product list, categories, and form inputs
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        HSN_code: '',
        tax_percentage: '',
        discount_rate: 0,
        unit: '',
        category: '',
        brand: '',
        price_after_tax: '',
        price_before_tax: '',
        sales_rank: '',
    });

    const [loading, setLoading] = useState(false);

    // Fetch products and categories
    useEffect(() => {
        fetchProducts();
    }, [searchQuery, selectedCategories]);

    const fetchProducts = async () => {
        setLoading(true);
        const url = new URL('https://nexotech.cc/api/product/');
        if (searchQuery) url.searchParams.append('search', searchQuery);
        selectedCategories.forEach(category => url.searchParams.append('categories', category));

        try {
            const response = await fetch(url, { method: 'GET', credentials: 'include' });
            const data = await response.json();
            if (response.ok) {
                setProducts(data.products);
                setCategories(data.categories);
            } else {
                console.error("Error fetching products:", data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    // Handle adding a new product
    const addProduct = async () => {
        try {
            const response = await fetch("https://nexotech.cc/api/product/", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newProduct,
                    created_by: "superadmin",  // Replace with dynamic user data if available
                    last_updated_by: "superadmin",
                }),
                credentials: "include",
            });

            if (response.ok) {
                alert("Product added successfully!");
                fetchProducts();
                setNewProduct({ name: '', HSN_code: '', tax_percentage: '', discount_rate: 0, unit: '', category: '', brand: '', price_after_tax: '', price_before_tax: '', sales_rank: '' });
            } else {
                const errorData = await response.json();
                console.error("Error response:", errorData);
            }
        } catch (error) {
            console.error("Failed to add product", error);
        }
    };

    // Handle editing a product
    const editProduct = (productId, updatedProduct) => {
        setProducts(products.map(product => product.product_id === productId ? { ...product, ...updatedProduct } : product));
    };

    // Handle deleting a product
    const deleteProduct = async (productId) => {
        try {
            const response = await fetch("https://nexotech.cc/api/product/", {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id: productId }),
                credentials: 'include',
            });

            if (response.ok) {
                alert("Product deleted successfully!");
                fetchProducts();
            } else {
                console.error("Failed to delete product");
            }
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    // Handle category filter change
    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategories(prevState =>
            prevState.includes(category) ? prevState.filter(c => c !== category) : [...prevState, category]
        );
    };

    // Handle price calculation
    const calculatePrice = () => {
        const { tax_percentage, price_before_tax, price_after_tax } = newProduct;
        const taxRate = parseFloat(tax_percentage) || 0;
        if (price_before_tax && !price_after_tax) {
            setNewProduct(prevState => ({
                ...prevState,
                price_after_tax: (parseFloat(price_before_tax) * (1 + taxRate / 100)).toFixed(2),
            }));
        } else if (!price_before_tax && price_after_tax) {
            setNewProduct(prevState => ({
                ...prevState,
                price_before_tax: (parseFloat(price_after_tax) / (1 + taxRate / 100)).toFixed(2),
            }));
        }
    };

    // Handle new product form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Render products
    const renderProducts = () => {
        return products.map(product => (
            <tr key={product.product_id}>
                {Object.entries(product).map(([key, value]) => {
                    if (key !== "product_id" && key !== "client_id") {
                        return (
                            <td key={key}>
                                <input
                                    type="text"
                                    value={value}
                                    disabled
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </td>
                        );
                    }
                    return null;
                })}
                <td>
                    <button onClick={() => editProduct(product.product_id, { name: 'Updated Name' })}>Edit</button>
                    <button onClick={() => deleteProduct(product.product_id)}>Delete</button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="product-management">
            <h1>Product Management</h1>

            {/* Search Bar */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => fetchProducts()}>Search</button>
            </div>

            {/* Category Filters */}
            <div className="category-filters">
                <h3>Filter by Categories</h3>
                {categories.map(category => (
                    <div key={category}>
                        <input
                            type="checkbox"
                            value={category}
                            onChange={handleCategoryChange}
                        />
                        <label>{category}</label>
                    </div>
                ))}
            </div>

            {/* Product List */}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>HSN Code</th>
                        <th>Tax Percentage</th>
                        <th>Price Before Tax</th>
                        <th>Price After Tax</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {renderProducts()}
                </tbody>
            </table>

            {/* Add New Product Form */}
            <h2>Add New Product</h2>
            <form>
                <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                />
                <input
                    type="text"
                    name="HSN_code"
                    value={newProduct.HSN_code}
                    onChange={handleInputChange}
                    placeholder="HSN Code"
                />
                <input
                    type="number"
                    name="tax_percentage"
                    value={newProduct.tax_percentage}
                    onChange={handleInputChange}
                    placeholder="Tax Percentage"
                />
                <input
                    type="number"
                    name="discount_rate"
                    value={newProduct.discount_rate}
                    onChange={handleInputChange}
                    placeholder="Discount Rate"
                />
                <input
                    type="text"
                    name="unit"
                    value={newProduct.unit}
                    onChange={handleInputChange}
                    placeholder="Unit"
                />
                <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <input
                    type="text"
                    name="brand"
                    value={newProduct.brand}
                    onChange={handleInputChange}
                    placeholder="Brand"
                />
                <input
                    type="number"
                    name="price_before_tax"
                    value={newProduct.price_before_tax}
                    onChange={handleInputChange}
                    placeholder="Price Before Tax"
                    onBlur={calculatePrice}
                />
                <input
                    type="number"
                    name="price_after_tax"
                    value={newProduct.price_after_tax}
                    onChange={handleInputChange}
                    placeholder="Price After Tax"
                    onBlur={calculatePrice}
                />
                <input
                    type="number"
                    name="sales_rank"
                    value={newProduct.sales_rank}
                    onChange={handleInputChange}
                    placeholder="Sales Rank"
                />
                <button type="button" onClick={addProduct}>Add Product</button>
            </form>

            {loading && <p>Loading...</p>}
        </div>
    );
};

export default ProductManagement;
