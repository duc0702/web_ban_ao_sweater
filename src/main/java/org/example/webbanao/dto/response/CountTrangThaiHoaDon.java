package org.example.webbanao.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.webbanao.enums.TrangThai;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CountTrangThaiHoaDon {
       Long soLuong;
       TrangThai trangThai;
}
