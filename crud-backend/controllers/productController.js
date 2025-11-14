import * as productService from "../services/productService.js";

export const getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts(); // Đổi
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createProduct = async (req, res) => { // Đổi
    try {
        const productData = req.body;
        const newProduct = await productService.createProduct(productData); // Đổi
        res.status(200).json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateProduct = async (req, res) => { // Đổi
    try {
        const productId = req.params.id;
        const productData = req.body;
        const updatedProduct = await productService.updateProduct(productData, productId); // Đổi
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' }); // Đổi
        }   
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error); // Đổi
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteProduct = async (req, res) => { // Đổi
    try {
        const productId = req.params.id;
        const deleted = await productService.deleteProduct(productId); // Đổi
        if (!deleted) {
             return res.status(404).json({ error: 'Product not found' }); // Sửa lại
        }
        res.status(200).json({ message: 'Product deleted successfully' }); // Đổi
    } catch (error) {
        console.error('Error deleting product:', error); // Đổi
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const searchProduct = async (req, res) => { // Đổi
    try {
        const searchTerm = req.query.q;
        const products = await productService.searchProducts(searchTerm); // Đổi  
        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching products:', error); // Đổi
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by id:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};