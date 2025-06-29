package org.example.webbanao.repository;

import org.example.webbanao.entity.ChiTietSanPham;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChiTietSanPhamRepository extends JpaRepository<ChiTietSanPham, Integer> {

    // Define custom query methods if needed
    // For example:
    // List<ChiTietSanPham> findBySomeCriteria(String criteria);
}
