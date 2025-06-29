package org.example.webbanao.repository;

import org.example.webbanao.dto.response.CountTrangThaiHoaDon;
import org.example.webbanao.dto.response.HoaDonResponse;
import org.example.webbanao.entity.HoaDon;
import org.example.webbanao.enums.TrangThai;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonRepository  extends JpaRepository<HoaDon, Integer>,JpaSpecificationExecutor<HoaDon> {

    @Query("SELECT h.trangThai AS trangThai, COUNT(*) AS soLuong FROM HoaDon h GROUP BY h.trangThai")
    List<CountTrangThaiHoaDon> getCoutnTrangThaiHoaDon();


}
