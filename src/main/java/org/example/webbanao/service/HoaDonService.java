package org.example.webbanao.service;

import org.example.webbanao.dto.request.HoaDonCreateRequest;
import org.example.webbanao.dto.request.HoaDonUpdateThongTinRequest;
import org.example.webbanao.dto.response.CapNhatTrangThaiResponse;
import org.example.webbanao.dto.response.HoaDonChiTietResponse;
import org.example.webbanao.dto.response.HoaDonHistoryResponse;
import org.example.webbanao.dto.response.HoaDonResponse;
import org.example.webbanao.entity.HoaDon;
import org.example.webbanao.enums.TrangThai;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public interface HoaDonService {
    HoaDonResponse taoHoaDon(HoaDonCreateRequest request);
    CapNhatTrangThaiResponse capNhatTrangThaiHoaDon(Integer idHoaDon, TrangThai trangThaiMoi, String ghiChu, String nguoiThucHien);
    List<HoaDonHistoryResponse> layLichSuThayDoiTrangThai(String  maHoaDon);
    HoaDonResponse getHoaDonById(Integer id);
    Page<HoaDonResponse> getFilteredHoaDon(
                                            TrangThai trangThai,
                                            String loaiHoaDon,
                                            LocalDate ngayTaoStart,
                                            LocalDate ngayTaoEnd,
                                            String searchTerm,
                                            Pageable pageable);
    public Map<TrangThai,Long> getStatusCounts();

    CapNhatTrangThaiResponse chuyenTrangThaiTiepTheo(Integer idHoaDon, String ghiChu, String nguoiThucHien);
    CapNhatTrangThaiResponse huyHoaDon(Integer idHoaDon, String ghiChu, String nguoiThucHien);
    public CapNhatTrangThaiResponse quayLaiTrangThaiTruoc(Integer idHoaDon, String ghiChu, String nguoiThucHien);
    String  capNhatThongTinHoaDon(Integer idHoaDon,HoaDonUpdateThongTinRequest request);
    // Sửa lại alias (AS) để tên tường minh và dễ ánh xạ

    List<HoaDonChiTietResponse> findChiTietHoaDon(@Param("idHoaDon") Integer idHoaDon);

}
