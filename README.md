## 🚗 Auto Accessories Store API Documentation

Welcome to the backend API documentation for the Auto Accessories Store project. This backend handles everything from user management, orders, returns, reviews, discounts, and more.

### 🔐 Authentication

All protected routes require a valid JWT token in the header:

```
Authorization: Bearer <your_token>
```

---

## 🧑‍💼 Users

### Register User

`POST /api/users/register`
Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login User

`POST /api/users/login`
Returns a token.

---

## 📦 Products

### Create Product (Admin)

`POST /api/products`
Protected: Admin only
Body includes product info: name, brand, price, etc.

### Get All Products

`GET /api/products`

### Get Single Product

`GET /api/products/:id`

### Update Product (Admin)

`PUT /api/products/:id`

### Delete Product (Admin)

`DELETE /api/products/:id`

---

## 🛒 Cart / Orders

### Create Order

`POST /api/orders`
Protected
Body:

```json
{
  "orderItems": [
    { "product": "<product_id>", "qty": 2 }
  ],
  "shippingAddress": {
    "address": "123 Street",
    "city": "Lagos",
    "postalCode": "12345",
    "country": "Nigeria"
  },
  "paymentMethod": "Paystack"
}
```

### Get User Orders

`GET /api/orders/myorders`
Protected

### Get All Orders (Admin)

`GET /api/orders/admin`
Query support:

* `status=pending`
* `user=<userId>`
* `startDate=2024-01-01&endDate=2025-12-31`
* `sortBy=totalPrice&order=asc`

### Update Order to Delivered

`PUT /api/orders/:id/deliver`
Protected: Admin

---

## 🔁 Returns & Refunds

### Submit Return Request

`POST /api/returns`
Protected
Body:

```json
{
  "orderId": "<orderId>",
  "reason": "Wrong item delivered"
}
```

### Get All Returns (Admin)

`GET /api/returns`
Protected: Admin

### Update Return Status

`PUT /api/returns/:id/status`
Protected: Admin
Body:

```json
{ "status": "approved" }
```

### Mark Order as Refunded

`PUT /api/returns/orders/:id/refund`
Restocks inventory too.

---

## 🧾 Discounts

### Create Discount (Admin)

`POST /api/discounts`
Body:

```json
{
  "code": "SAVE20",
  "percentage": 20,
  "expiresAt": "2025-06-30"
}
```

### Toggle Discount (Admin)

`PUT /api/discounts/:id/toggle`

---

## 📝 Product Reviews

### Create Review

`POST /api/reviews`
Protected
Body:

```json
{
  "productId": "<product_id>",
  "rating": 4,
  "comment": "Great quality!"
}
```

### Get Reviews for Product

`GET /api/reviews/product/<product_id>`

### Delete Review

`DELETE /api/reviews/:id`
Admin only

---

## 🛡️ Rate Limiting

* Limited to **20 requests per hour per IP** using express-rate-limit middleware.
* Applies globally on all endpoints.

---

## 📁 File Structure Suggestion

```
/controllers
/models
/routes
/middleware
/utils
/docs
README.md ✅