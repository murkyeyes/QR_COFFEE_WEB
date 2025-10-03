const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// phục vụ file tĩnh (index.html, css, ảnh…)
app.use(express.static(__dirname));

// API trả thông tin sản phẩm
app.get('/api/product/:id', (req, res) => {
  const products = {
    1: {
      product_id: 1,
      name: "Cà phê rang xay Robusta",
      category: "Đồ uống",
      origin: "Buôn Ma Thuột, Việt Nam",
      farm: "Nông trại Buôn Ma Thuột",
      website: "https://vncoffee.vn/",
      expire_date: "2026-06-30",
      price_original: 80000,
      price_sell: 95000
    },
    2: {
      product_id: 2,
      name: "Cà phê hạt Arabica",
      category: "Đồ uống",
      origin: "Cầu Đất, Lâm Đồng",
      farm: "Cầu Đất Farm",
      website: "https://caudatfarm.com/",
      expire_date: "2026-06-30",
      price_original: 120000,
      price_sell: 150000
    },
    3: {
      product_id: 3,
      name: "Cà phê Chồn (Kopi Luwak)",
      category: "Đồ uống cao cấp",
      origin: "Tây Nguyên, Việt Nam",
      farm: "Trang trại đặc sản",
      website: "https://trungnguyenlegend.com/",
      expire_date: "2026-06-30",
      price_original: 1000000,
      price_sell: 1200000
    },
    4: {
      product_id: 4,
      name: "Cà phê Excelsa (Chari)",
      category: "Đồ uống",
      origin: "Gia Lai",
      farm: "Nông trại địa phương",
      website: "https://vncoffee.vn/",
      expire_date: "2026-09-01",
      price_original: 180000,
      price_sell: 200000
    },
    5: {
      product_id: 5,
      name: "Cà phê Liberica (Mít)",
      category: "Đồ uống",
      origin: "Quảng Trị, Nghệ An",
      farm: "Trang trại cà phê mít",
      website: "https://vncoffee.vn/",
      expire_date: "2026-09-01",
      price_original: 200000,
      price_sell: 220000
    }
  };

  res.json(products[req.params.id] || { error: "Không tìm thấy sản phẩm" });
});

// route mở trực tiếp file HTML
app.get('/product/:id', (req, res) => {
  const id = req.params.id;
  if (["1","2","3","4","5"].includes(id)) {
    res.sendFile(path.join(__dirname, 'products', `${id}.html`));
  } else {
    res.send("<h2 style='color:red;text-align:center'>❌ Không tìm thấy sản phẩm</h2>");
  }
});

// route mặc định
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
