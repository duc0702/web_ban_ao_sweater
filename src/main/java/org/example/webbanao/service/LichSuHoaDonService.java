package org.example.webbanao.service;

import org.example.webbanao.dto.response.HoaDonHistoryResponse;
import org.example.webbanao.entity.HoaDon;
import org.example.webbanao.enums.TrangThai;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface LichSuHoaDonService {
    void ghiNhanLichSuHoaDon(HoaDon hoaDon, String noiDungThayDoi, String nguoiThucHien, String ghiChu, TrangThai trangThaiMoi);

    List<HoaDonHistoryResponse> layLichSuThayDoiTrangThai(String maHoaDon);
}
