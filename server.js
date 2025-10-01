const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Dữ liệu mẫu (sau này có thể thay bằng database)
const products = {
  1: {
    product_id: 1,
    name: "Cà phê rang xay Robusta",
    category: "Đồ uống",
    origin: "Buôn Ma Thuột, Đắk Lắk",
    farm: "Nông trại Trung Nguyên",
    website: "https://trungnguyenlegend.com/",
    expire_date: "2026-12-12",
    price_original: 120000,
    price_sell: 150000,
  },
  2: {
    product_id: 2,
    name: "Cà phê hạt Arabica",
    category: "Đồ uống",
    origin: "Cầu Đất, Lâm Đồng",
    farm: "Farm Cầu Đất",
    website: "https://caudatfarm.com/",
    expire_date: "2026-10-01",
    price_original: 200000,
    price_sell: 250000,
  },
  3: {
    product_id: 3,
    name: "Cà phê hòa tan G7",
    category: "Đồ uống",
    origin: "TP. Hồ Chí Minh",
    farm: "Trung Nguyên Factory",
    website: "https://trungnguyenlegend.com/",
    expire_date: "2025-08-05",
    price_original: 50000,
    price_sell: 70000,
  },
};

// Phục vụ file tĩnh (HTML, CSS, JS, ảnh…)
app.use(express.static(__dirname));

// Trang chủ → index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API trả về JSON sản phẩm
app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = products[id];
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Không tìm thấy sản phẩm" });
  }
});

// Chạy server
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
