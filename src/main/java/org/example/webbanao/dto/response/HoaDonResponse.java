package org.example.webbanao.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.webbanao.entity.HoaDonChiTiet;
import org.example.webbanao.enums.TrangThai;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HoaDonResponse {
    private Integer id;
    private LocalDateTime ngayTao;
    private LocalDateTime ngayGiaoDuKien;
    private TrangThai trangThai;
    private String ghiChu;
    private String maHoaDon;

    private String tenKhachHang;
    private String sdt;
    private String diaChi;
    private String tenSanPham;

    private String tenNhanVien;
//    private String maPhieuGiamGia;
    private String loaiHoaDon;
    private List<HoaDonChiTietResponse> danhSachChiTiet;

    private Double tongTienBanDau;   // Tổng tiền trước khi giảm giá
    private Double tongTien;         // Tổng sau giảm giá, chưa bao gồm phí vận chuyển
    private Double phiVanChuyen;     // Phí vận chuyển
    private Double tongHoaDon;       // Tổng
}
