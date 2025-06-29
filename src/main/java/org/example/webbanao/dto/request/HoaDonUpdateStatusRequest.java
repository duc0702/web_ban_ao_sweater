package org.example.webbanao.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.webbanao.enums.TrangThai;
@Data
public class HoaDonUpdateStatusRequest {

    @NotNull(message = "Trạng thái mới không được trống")
    private TrangThai trangThaiMoi; // Trạng thái mới của hóa đơn
    private String ghiChu;
}
