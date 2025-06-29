package org.example.webbanao.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HoaDonUpdateThongTinRequest {
    @NotBlank(message = "Tên khách hàng không được để trống")
    @Size(min = 2, max = 255, message = "Tên khách hàng phải từ 2 đến 255 ký tự")
    private String tenKhachHang;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|\\+84)(\\d{9}|\\d{10})$", message = "Số điện thoại không hợp lệ")
    private String sdt;

    @NotBlank(message = "Địa chỉ không được để trống")
    @Size(min = 5, max = 500, message = "Địa chỉ phải từ 5 đến 500 ký tự")
    private String diaChi;

    @Size(max = 1000, message = "Ghi chú không được vượt quá 1000 ký tự")
    private String ghiChu; 
}
