package org.example.webbanao.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CapNhatTrangThaiResponse {
    private Integer idHoaDon;
    private String trangThaiMoi;
    private String tenTrangThaiMoi;
    private String message;
}
