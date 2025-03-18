var express = require('express');
var router = express.Router();
const modelCart = require('../models/model_cart');

module.exports = {
  // add data
//   add: async (req, res) => {
//       try {
//         console.log("đã vào dây");
//           const model = new modelCart(req.body);
//           console.log("Data to be saved:", model);
//           const result = await model.save();
//           if (result) {
//               res.json({
//                   "status": 200,
//                   "message": "Thêm thành công",
//                   "data": result
//               });
//           } else {
//               res.json({
//                   "status": 400,
//                   "message": "Thêm thất bại",
//                   "data": []
//               });
//           }
//       } catch (err) {
//           console.error("Error while saving user:", err);
//           res.status(500).send({ error: 'An error occurred while saving data' });
//       }
//   },
 
add: async (req, res) => {
  try {
    const { id_user, id_product, purchaseQuantity } = req.body;

    if (!id_user || !id_product) {
      return res.status(400).json({
        status: 400,
        message: "Missing user ID or product ID"
      });
    }

    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingCartItem = await modelCart.findOne({
      id_user,
      id_product
    });

    if (existingCartItem) {
      // Nếu đã tồn tại, tăng số lượng lên
      existingCartItem.purchaseQuantity += purchaseQuantity;
      const result = await existingCartItem.save();
      return res.json({
        status: 200,
        message: "Cập nhật số lượng thành công",
        data: result
      });
    }

    // Nếu chưa tồn tại, tạo mới
    const cartItem = new modelCart({
      id_user,
      id_product,
      purchaseQuantity
    });

    const result = await cartItem.save();
    res.json({
      status: 200,
      message: "Thêm vào giỏ hàng thành công",
      data: result
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      status: 500,
      message: "Lỗi khi thêm vào giỏ hàng",
      error: error.message
    });
  }
},

  // lấy toàn bộ dữ liệu ra
  list: async (req, res) => {
      try {
          const result = await modelCart.find();
          if (result) {
              res.json({
                  "status": 200,
                  "message": "List",
                  "data": result
              });
          } else {
              res.json({
                  "status": 400,
                  "message": "Lỗi",
                  "data": []
              });
          }
      } catch (err) {
          console.error("Error while fetching users:", err); 
          res.status(500).send({ error: 'An error occurred while fetching data' }); 
      }
  },

  // lấy dữ liệu theo ID
  getbyid: async (req, res) => {
      try {
          const result = await modelCart.findById(req.params.id);
          if (result) {
              res.json({
                  "status": 200,
                  "message": "Đã tìm thấy ID",
                  "data": result
              })
          } else {
              res.json({
                  "status": 400,
                  "message": "Không tìm thấy ID",
                  "data": []
              })
          }
      } catch (error) {
          if (error.name === 'CastError') {
              res.status(404).send('Invalid ID format');
          } else {
              console.log(error);
              res.status(500).send('Invalid Server format');
          }
      }
  },

  // sử thông tin
  edit: async (req, res) => {
      try {
          const result = await modelCart.findByIdAndUpdate(req.params.id, req.body);
          if (result) {
              const rs = await result.save();
              res.json({
                  "status": 200,
                  "message": "Cập nhật thành công",
                  "data": rs
              })
          } else {
              res.json({
                  "status": 400,
                  "message": "Cập nhật thất bại",
                  "data": []
              })
          }
      } catch (error) {
          if (error.name === 'CastError') {
              res.status(404).send('Invalid ID format');
          } else {
              console.log(error);
              res.status(500).send('Invalid Server format');
          }
      }
  },

  // Xóa dữ liệu theo ID
  delete: async (req, res) => {
      try {
          const result = await modelCart.findByIdAndDelete(req.params.id);
          if (result) {
              res.json({
                  "status": 200,
                  "message": "Xóa thành công",
                  "data": result
              });
          } else {
              res.json({
                  "status": 400,
                  "message": "Xóa thất bại",
                  "data": []
              });
          }
      } catch (error) {
          console.log(error);
      }
  },

  // search tìm kiếm
  search: async (req, res) => {
      try {
          const key = req.query.key;
          const result = await modelCart.find({ name: { "$regex": key, "$options": 'i' } })
              .sort({ createdAt: -1 })
          if (result) {
              res.json({
                  "status": 200,
                  "message": "List",
                  "data": result
              });
          } else {
              res.json({
                  "status": 400,
                  "message": "Lỗi",
                  "data": []
              });
          }
      } catch (err) {
          console.error("Error while fetching users:", err); 
          res.status(500).send({ error: 'An error occurred while fetching data' }); 
      }
  }
}
