package org.example.webbanao.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "san_pham")
public class SanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_chat_lieu")
    private ChatLieu chatLieu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_thuong_hieu")
    private ThuongHieu thuongHieu;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_xuat_xu")
    private XuatXu xuatXu;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_danh_muc")
    private DanhMuc danhMuc;

    @Column(name = "ma_san_pham", length = 50)
    private String maSanPham;

    @Column(name = "ten_san_pham", length = 50)
    private String tenSanPham;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @OneToMany(mappedBy = "sanPham", fetch = FetchType.LAZY)
    private List<ChiTietSanPham> chiTietSanPhams;

}