package org.example.webbanao.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "vai_tro")
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class VaiTro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "ten")
    String ten;

    @Column(name = "mo_ta_vai_tro")
    String moTaVaiTro;

    @OneToMany(mappedBy = "vaiTro")
    List<NhanVien> nhanViens; // Một vai trò có nhiều nhân viên
}