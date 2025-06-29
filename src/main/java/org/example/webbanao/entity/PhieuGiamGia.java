package org.example.webbanao.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "phieu_giam_gia")
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class PhieuGiamGia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "ma_phieu_giam_gia")
    String maPhieuGiamGia;

    @Column(name = "dieu_kien_giam")
    String dieuKienGiam;

    @Column(name = "ten_phieu")
    String tenPhieu;

    Integer loaiPhieu;

    @Column(name = "pham_tram_giam_gia")
    Double phamTramGiamGia;

    @Column(name = "so_tien_giam")
    Double soTienGiam;

    @Column(name = "giam_toi_da")
    Double giamToiDa;

    @Column(name = "ngay_bat_dau")
    LocalDateTime ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    LocalDateTime ngayKetThuc;

    @Column(name = "ngay_tao")
    LocalDateTime ngayTao;

    @Column(name = "ngay_cap_nhat")
    LocalDateTime ngayCapNhat;

    @Column(name = "ghi_chu")
    String ghiChu;

    @Column(name = "trang_thai")
    Integer trangThai;

}

