import React from "react";

import styles from "./ProductList.module.css";
import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
const BASE_SERVER_URL = "http://localhost:8080/";
const ProductList = ({ orderId }) => {
  console.log(orderId)
 const [orderData,setOrderData ] = useState(null); // Lưu toàn bộ phản hồi
  const [productsInOrder, setProductsInOrder] = useState([]);
  useEffect(() => {
 
    if (!orderId) {
     setProducts([]);
      return;
    }
    const fetchListProductOrder = async () => {
      try {
        // Gọi API bằng fetch, 'await' sẽ đợi cho đến khi có phản hồi
        const response = await fetch(`http://localhost:8080/api/hoa-don/${orderId}/san-pham`);

        if (!response.ok) {
          throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
        }

        // Chuyển đổi phản hồi sang định dạng JSON, 'await' cũng sẽ đợi quá trình này
        const data = await response.json();
       
        setOrderData(data);
        if (data && Array.isArray(data.data)) {
          setProductsInOrder(data.data); // LƯU MẢNG NÀY VÀO state riêng
        } else {
          setProductsInOrder([]); // Đảm bảo luôn là mảng rỗng
        }
      } catch (error) {
        console.error("Không thể fetch dữ liệu:", error);

        return null;
      }
    };
    fetchListProductOrder();
  }, [orderId]);
  
  return (
    <div className={styles["product-list"]}>
      <div className={styles["product-list-header"]}>
        <button className={`${styles.btn} ${styles.btnConfirm}`}>Thêm sản phẩm</button>
      </div>

      {/* Kiểm tra nếu không có sản phẩm nào */}
      {productsInOrder.length === 0 ? (
        <div >Không có sản phẩm nào trong đơn hàng này.</div>
      ) : (
        // Map dữ liệu từ state 'products' đã được fetch ở trên
        productsInOrder.map((product) => (
          <div key={product.id || product.maSanPhamChiTiet} className={styles["product-item"]}>
          <div className={styles["product-image"]}>
              <img
         
                src={ (BASE_SERVER_URL + product.duongDanAnh) }
                alt={product.tenSanPham} // Sử dụng 'tenSanPham' cho alt text
              />
            </div>
            <div className={styles["product-details"]}>
              <p className={styles["product-name"]}>
                {product.tenSanPham} ({product.maSanPhamChiTiet})
              </p>
              <p className={styles["product-price"]}>
                {(product.thanhTien || 0).toLocaleString("vi-VN")} VND
              </p>
              <p className={styles["product-info"]}>Size: {product.tenKichThuoc}</p>
              <p className={styles["product-info"]}>x{product.soLuong}</p>
            </div>
            <div className={styles["product-quantity-control"]}>
              <button>-</button>
              <span>{product.soLuong}</span>
              <button>+</button>
            </div>
            <div className={styles["product-total-price"]}>
              {((product.gia || 0) * (product.soLuong || 0)).toLocaleString("vi-VN")} VND
            </div>
          </div>
        ))
      )}
    </div>
  );
};
ProductList.propTypes = {
   orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ProductList;
