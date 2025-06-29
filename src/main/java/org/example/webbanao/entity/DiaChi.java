package org.example.webbanao.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Table(name = "dia_chi")
public class DiaChi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    KhachHang kahchhang;

    @Column(name = "tinh_thanh_pho", length = 100)
     String tinhThanhPho;

    @Column(name = "quan_huyen", length = 100)
     String quanHuyen;

    @Column(name = "xa_phuong", length = 100)
     String xaPhuong;

    @Column(name = "trang_thai")
     int trangThai;
}
