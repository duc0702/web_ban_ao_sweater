package org.example.webbanao.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "nhan_vien")
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class NhanVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "id_vai_tro") // Khóa ngoại tới vai_tro.id
    VaiTro vaiTro;


    @Column(name = "ma_nhan_vien")
    String maNhanVien;

    @Column(name = "ho_va_ten")
    String hoVaTen;

    @Column(name = "hinh_anh", columnDefinition = "TEXT")
    String hinhAnh;

    @Column(name = "gioi_tinh")
    Boolean gioiTinh;

    @Column(name = "ngay_sinh")
    LocalDate ngaySinh;

    @Column(name = "so_dien_thoai")
    String soDienThoai;

    @Column(name = "can_cuoc_cong_dan")
    String canCuocCongDan;

    @Column(name = "email")
    String email;

    @Column(name = "ten_tai_khoan")
    String tenTaiKhoan;

    @Column(name = "mat_khau")
    String matKhau;

    @Column(name = "chuc_vu")
    String chucVu;

    @Column(name = "trang_thai")
    Integer trangThai;


}
