shopoo/
├── src/
│   ├── controllers/        # Xử lý logic business
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── models/            # MongoDB schemas với Mongoose
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Category.js
│   │   └── Cart.js
│   ├── routes/            # API routes và web routes
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── cart.js
│   │   │   └── orders.js
│   │   ├── web/
│   │   │   ├── index.js
│   │   │   ├── products.js
│   │   │   └── admin.js
│   │   └── index.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── upload.js
│   └── config/           # Cấu hình database và app
│       ├── database.js
│       ├── jwt.js
│       └── multer.js
├── public/
│   ├── css/              # Stylesheets
│   │   ├── main.css
│   │   ├── products.css
│   │   ├── cart.css
│   │   └── admin.css
│   ├── js/               # Client-side JavaScript
│   │   ├── main.js
│   │   ├── cart.js
│   │   ├── products.js
│   │   └── admin.js
│   └── images/           # Hình ảnh tĩnh
│       ├── logo.png
│       ├── products/
│       └── banners/
├── views/
│   ├── partials/         # EJS partials
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   ├── navbar.ejs
│   │   └── sidebar.ejs
│   ├── pages/            # Các trang chính
│   │   ├── index.ejs
│   │   ├── products.ejs
│   │   ├── product-detail.ejs
│   │   ├── cart.ejs
│   │   ├── login.ejs
│   │   ├── register.ejs
│   │   ├── profile.ejs
│   │   └── orders.ejs
│   └── admin/            # Trang admin
│       ├── dashboard.ejs
│       ├── products.ejs
│       ├── orders.ejs
│       └── users.ejs
├── uploads/              # Thư mục upload (sẽ tạo khi cần)
├── package.json
├── server.js             # Entry point
├── .env.example          # Template environment variables
├── .gitignore
└── README.md
