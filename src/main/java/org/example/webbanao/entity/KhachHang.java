package org.example.webbanao.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "khach_hang")
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "ma_khach_hang")
    String maKhachHang;

    @Column(name = "ten_tai_khoan")
    String tenTaiKhoan;

    @Column(name = "mat_khau")
    String matKhau;

    @Column(name = "ten_khach_hang")
    String tenKhachHang;

    @Column(name = "email")
    String email;

    @Column(name = "gioi_tinh")
    Boolean gioiTinh;

    @Column(name = "sdt")
    String sdt;

    @Column(name = "ngay_sinh")
    LocalDate ngaySinh;

    @Column(name = "ghi_chu")
    String ghiChu;

    @Column(name = "hinh_anh")
    String hinhAnh;

    @Column(name = "trang_thai")
    Integer trangThai;


}
