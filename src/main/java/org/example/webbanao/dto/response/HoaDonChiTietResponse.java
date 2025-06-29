package org.example.webbanao.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HoaDonChiTietResponse {
      Integer id; // ID của bản ghi HoaDonChiTiet
      String maSanPhamChiTiet;
      Integer soLuong;
      Integer gia;
      Integer thanhTien;
      @JsonIgnore
      String ghiChu;
      @JsonIgnore
      Boolean trangThai;
      String tenSanPham;
      String tenMauSac;
      String tenKichThuoc;

      String duongDanAnh;


}
