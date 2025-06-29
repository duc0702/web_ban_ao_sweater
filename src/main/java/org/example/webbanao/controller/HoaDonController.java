package org.example.webbanao.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.webbanao.dto.request.HoaDonCreateRequest;
import org.example.webbanao.dto.request.HoaDonUpdateStatusRequest;
import org.example.webbanao.dto.request.HoaDonUpdateThongTinRequest;
import org.example.webbanao.dto.request.LichSuRequest;
import org.example.webbanao.dto.response.*;
import org.example.webbanao.enums.TrangThai;
import org.example.webbanao.exception.AppException;
import org.example.webbanao.service.HoaDonService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000" +
        "")
@RestController
@RequestMapping("/api/hoa-don")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HoaDonController {
    HoaDonService hoaDonService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<HoaDonResponse>> createHoaDon(@RequestBody @Valid HoaDonCreateRequest request) {
        HoaDonResponse hoaDonResponse = hoaDonService.taoHoaDon(request);

        ApiResponse<HoaDonResponse> response = ApiResponse.<HoaDonResponse>builder()
                .code(1000)
                .message("Hóa đơn đã được tạo thành công")
                .data(hoaDonResponse)
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public HoaDonResponse getHoaDonDetails(@PathVariable Integer id) {
        return hoaDonService.getHoaDonById(id);
    }

    @GetMapping("/lich-su/{maHoaDon}")
    public List<HoaDonHistoryResponse> getHoaDonHistory(@PathVariable("maHoaDon") String maHoaDon) {
        return hoaDonService.layLichSuThayDoiTrangThai(maHoaDon);
    }

    @PutMapping("/trang-thai/{id}")
    public CapNhatTrangThaiResponse updateHoaDonStatus(@PathVariable Integer id, @RequestBody @Validated HoaDonUpdateStatusRequest request) {
        // Tham số 'nguoiThucHien' này sẽ được Service tự quyết định dựa trên HoaDon.getNhanVien()
        String nguoiThucHienPlaceholder = "Nhân viên A"; // Giá trị giả lập
        return hoaDonService.capNhatTrangThaiHoaDon(id, request.getTrangThaiMoi(), request.getGhiChu(), nguoiThucHienPlaceholder);
    }

    @GetMapping
    public ApiResponse<Page<HoaDonResponse>> getAllHoaDon(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) TrangThai trangThai,
            @RequestParam(required = false) String loaiHoaDon,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTaoStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTaoEnd,
            @RequestParam(required = false) String searchTerm) { // Thêm searchTerm vào đây

        Pageable pageable = PageRequest.of(page, size);
        Page<HoaDonResponse> hoaDonPage = hoaDonService.getFilteredHoaDon(
                trangThai, loaiHoaDon, ngayTaoStart, ngayTaoEnd,
                searchTerm,
                pageable
        );

        return ApiResponse.<Page<HoaDonResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách hóa đơn thành công")
                .data(hoaDonPage)
                .build();
    }

    @GetMapping("/status-counts")
    public ResponseEntity<ApiResponse<Map<TrangThai, Long>>> getStatusCounts() {
        Map<TrangThai, Long> counts = hoaDonService.getStatusCounts();
        ApiResponse<Map<TrangThai, Long>> response = ApiResponse.<Map<TrangThai, Long>>builder()
                .code(1000)
                .message("Hóa đơn đã được tạo thành công")
                .data(counts)
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/chuyen-trang-thai-tiep-theo/{id}") // Changed to PUT mapping
    public ResponseEntity<CapNhatTrangThaiResponse> chuyenTrangThaiTiepTheo(
            @PathVariable("id") Integer idHoaDon,
            @RequestBody LichSuRequest request) {

        CapNhatTrangThaiResponse response = hoaDonService.chuyenTrangThaiTiepTheo(
                idHoaDon,
                request.getGhiChu(),
                request.getNguoiThucHien()
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/chuyen-trang-thai-huy/{id}") // Changed to PUT mapping
    public ResponseEntity<CapNhatTrangThaiResponse> chuyenTrangThaiHuy(
            @PathVariable("id") Integer idHoaDon,
            @RequestBody LichSuRequest request) {

        CapNhatTrangThaiResponse response = hoaDonService.huyHoaDon(
                idHoaDon,
                request.getGhiChu(),
                request.getNguoiThucHien()
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/cap-nhat-thong-tin/{id}")
    public ResponseEntity<ApiResponse<Void>> updateHoaDonInfo(
            @PathVariable Integer id,
            @RequestBody @Valid HoaDonUpdateThongTinRequest request) {

        // Gọi service. Nếu service ném AppException, nó sẽ được GlobalExceptionHandler xử lý
        String successMessage = hoaDonService.capNhatThongTinHoaDon(id, request);

        // Nếu service trả về thành công, xây dựng ApiResponse thành công
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code(1000) // Code thành công của bạn
                .message(successMessage) // Lấy thông báo từ service
                .build();
        return new ResponseEntity<>(apiResponse, HttpStatus.OK); // Trả về 200 OK
    }
    @GetMapping("/{idHoaDon}/san-pham")
    public ResponseEntity<ApiResponse<List<HoaDonChiTietResponse>>> getHoaDonChiTietResponse(@PathVariable Integer idHoaDon) {
        List<HoaDonChiTietResponse> hoaDonChiTietResponseList = hoaDonService.findChiTietHoaDon(idHoaDon);

        ApiResponse<List<HoaDonChiTietResponse>> apiResponse= ApiResponse.<List<HoaDonChiTietResponse>>builder()
                .code(1000)
                .message("Lấy danh sách sản phẩm của hóa đơn thành công")
                .data(hoaDonChiTietResponseList)
                .build();
        return ResponseEntity.ok(apiResponse);

    }
}
