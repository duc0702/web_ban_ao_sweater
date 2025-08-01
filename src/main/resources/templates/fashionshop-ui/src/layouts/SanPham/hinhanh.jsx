import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Icon from "@mui/material/Icon";
import Table from "examples/Tables/Table";
import { FaQrcode, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const statusList = ["Tất cả", "Hiển thị", "Ẩn"];
const viewOptions = [5, 10, 20];

const statusToInt = (val) => (val === "Hiển thị" || val === 1 ? 1 : 0);
const intToStatus = (val) => (val === 1 ? "Hiển thị" : "Ẩn");

const normalizeUrl = (url) =>
    url?.startsWith("http") ? url : `http://localhost:8080${url?.startsWith("/") ? "" : "/"}${url || ""}`;

function ImageTable() {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [previewImg, setPreviewImg] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(viewOptions[0]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Chú ý: field theo entity BE là camelCase
  const [formData, setFormData] = useState({
    maAnh: "",
    duongDanAnh: null, // file
    anhMacDinh: false,
    moTa: "",
    trangThai: "Hiển thị",
  });

  // Fetch images
  const fetchImages = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        size,
        moTa: search,
        trangThai: statusFilter === "Tất cả" ? undefined : (statusFilter === "Hiển thị" ? 1 : 0),
      };
      const queryString = Object.keys(params)
          .filter((k) => params[k] !== undefined && params[k] !== "")
          .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
          .join("&");
      const res = await fetch(`http://localhost:8080/hinhAnh?${queryString}`);
      if (!res.ok) throw new Error("Không thể tải dữ liệu.");
      const data = await res.json();
      setImages(
          (data.content || []).map((img) => ({
            ...img,
            anhMacDinh: img.anhMacDinh === 1,
            trangThai: intToStatus(img.trangThai),
          }))
      );
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      setImages([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, [search, statusFilter, page, size]);

  // Modal handlers
  const handleShowAddModal = () => {
    setEditingImage(null);
    setFormData({
      maAnh: "",
      duongDanAnh: null,
      anhMacDinh: false,
      moTa: "",
      trangThai: "Hiển thị",
    });
    setPreviewImg("");
    setShowModal(true);
  };

  const handleShowEditModal = (img) => {
    setEditingImage(img);
    setFormData({
      maAnh: img.maAnh || "",
      duongDanAnh: null,
      anhMacDinh: img.anhMacDinh === 1,
      moTa: img.moTa || "",
      trangThai: intToStatus(img.trangThai),
    });
    setPreviewImg(normalizeUrl(img.duongDanAnh));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPreviewImg("");
  };

  // Form change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          duongDanAnh: file,
        }));
        setPreviewImg(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Save image (add or edit)
  const handleSave = async () => {
    if (!(formData.maAnh || "").trim() || !(formData.moTa || "").trim() || (!editingImage && !formData.duongDanAnh)) {
      alert("Vui lòng nhập đầy đủ thông tin và chọn ảnh!");
      return;
    }
    const data = new FormData();
    data.append("maAnh", formData.maAnh || "");
    if (formData.duongDanAnh) data.append("duongDanAnh", formData.duongDanAnh);
    data.append("anhMacDinh", formData.anhMacDinh ? 1 : 0);
    data.append("moTa", formData.moTa || "");
    data.append("trangThai", formData.trangThai === "Hiển thị" ? 1 : 0);
    try {
      if (editingImage) {
        const res = await fetch(`http://localhost:8080/hinhAnh/${editingImage.id}`, {
          method: "PUT",
          body: data,
        });
        if (!res.ok) throw new Error("Có lỗi xảy ra khi lưu hình ảnh!");
      } else {
        const res = await fetch("http://localhost:8080/hinhAnh", {
          method: "POST",
          body: data,
        });
        if (!res.ok) throw new Error("Có lỗi xảy ra khi lưu hình ảnh!");
      }
      setShowModal(false);
      fetchImages();
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu hình ảnh!");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hình ảnh này?")) {
      try {
        const res = await fetch(`http://localhost:8080/hinhAnh/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        fetchImages();
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa hình ảnh!");
      }
    }
  };

  // Table columns
  const columns = [
    { name: "stt", label: "STT", align: "center", width: 60 },
    {
      name: "maAnh",
      label: "Mã ảnh",
      align: "center",
      width: 100,
    },
    {
      name: "img",
      label: "Ảnh",
      align: "center",
      width: 70,
      render: (val, row) => (
          <img
              src={normalizeUrl(row.duongDanAnh)}
              alt="Ảnh"
              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
          />
      ),
    },
    { name: "moTa", label: "Mô tả", align: "left", width: 200 },
    {
      name: "anhMacDinh",
      label: "Mặc định",
      align: "center",
      width: 80,
      render: (val) =>
          val ? (
              <span
                  style={{
                    background: "#49a3f1",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "2px 10px",
                    fontSize: 13,
                  }}
              >
            Mặc định
          </span>
          ) : (
              ""
          ),
    },
    {
      name: "trangThai",
      label: "Trạng thái",
      align: "center",
      width: 110,
      render: (val) => (
          <span
              style={{
                background: val === "Hiển thị" ? "#e6f4ea" : "#f4f6fb",
                color: val === "Hiển thị" ? "#219653" : "#bdbdbd",
                border: `1px solid ${val === "Hiển thị" ? "#219653" : "#bdbdbd"}`,
                borderRadius: 6,
                fontWeight: 500,
                padding: "2px 12px",
                fontSize: 13,
                display: "inline-block",
                minWidth: 60,
                textAlign: "center",
              }}
          >
          {val}
        </span>
      ),
    },
    {
      name: "actions",
      label: "Thao tác",
      align: "center",
      width: 110,
      render: (_, row) => (
          <SoftBox display="flex" gap={0.5} justifyContent="center">
            <IconButton size="small" sx={{ color: "#4acbf2" }} title="Sửa" onClick={() => handleShowEditModal(row)}>
              <FaEdit />
            </IconButton>
            <IconButton size="small" sx={{ color: "#4acbf2" }} title="Xóa" onClick={() => handleDelete(row.id)}>
              <FaTrash />
            </IconButton>
          </SoftBox>
      ),
    },
  ];

  const rows = images.map((img, idx) => ({
    stt: page * size + idx + 1,
    ...img,
    img: img.duongDanAnh,
    actions: "",
  }));

  // Pagination (material)
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
  };

  // Menu actions
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}>
          {/* Card filter/search/action */}
          <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
            <SoftBox
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                alignItems="center"
                justifyContent="space-between"
                gap={2}
            >
              <SoftBox flex={1} display="flex" alignItems="center" gap={2} maxWidth={600}>
                <Input
                    fullWidth
                    placeholder="Tìm mô tả ảnh"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(0);
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon fontSize="small" sx={{ color: "#868686" }}>
                          search
                        </Icon>
                      </InputAdornment>
                    }
                    sx={{ background: "#f5f6fa", borderRadius: 2, p: 0.5, color: "#222" }}
                />
                <FormControl sx={{ minWidth: 140 }}>
                  <Select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(0);
                      }}
                      size="small"
                      displayEmpty
                      sx={{ borderRadius: 2, background: "#f5f6fa", height: 40 }}
                      inputProps={{ "aria-label": "Trạng thái" }}
                  >
                    {statusList.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </SoftBox>
              <SoftBox display="flex" alignItems="center" gap={1}>
                <IconButton onClick={handleMenuOpen} sx={{ color: "#495057" }}>
                  <Icon fontSize="small">menu</Icon>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={handleMenuClose} sx={{ color: "#384D6C" }}>
                    <FaQrcode className="me-2" style={{ color: "#0d6efd" }} /> Quét mã
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose} sx={{ color: "#384D6C" }}>
                    <span style={{ color: "#27ae60", marginRight: 8 }}>📥</span> Export
                  </MenuItem>
                </Menu>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FaPlus />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 400,
                      color: "#49a3f1",
                      borderColor: "#49a3f1",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#1769aa",
                        background: "#f0f6fd",
                        color: "#1769aa",
                      },
                    }}
                    onClick={handleShowAddModal}
                >
                  Thêm hình ảnh
                </Button>
              </SoftBox>
            </SoftBox>
          </Card>

          {/* Card Table/Pagination */}
          <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <SoftBox>
              <Table columns={columns} rows={rows} loading={loading} />
            </SoftBox>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" mt={2} flexWrap="wrap" gap={2}>
              <SoftBox>
                <FormControl sx={{ minWidth: 120 }}>
                  <Select
                      value={size}
                      onChange={(e) => {
                        setSize(Number(e.target.value));
                        setPage(0);
                      }}
                      size="small"
                  >
                    {viewOptions.map((n) => (
                        <MenuItem key={n} value={n}>
                          Xem {n}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </SoftBox>
              <SoftBox display="flex" alignItems="center" gap={1}>
                <Button
                    variant="text"
                    size="small"
                    disabled={page === 0}
                    onClick={() => handlePageChange(page - 1)}
                    sx={{ color: page === 0 ? "#bdbdbd" : "#49a3f1" }}
                >
                  Trước
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                        key={i + 1}
                        variant={page === i ? "contained" : "text"}
                        color={page === i ? "info" : "inherit"}
                        size="small"
                        onClick={() => handlePageChange(i)}
                        sx={{
                          minWidth: 32,
                          borderRadius: 2,
                          color: page === i ? "#fff" : "#495057",
                          background: page === i ? "#49a3f1" : "transparent",
                        }}
                    >
                      {i + 1}
                    </Button>
                ))}
                <Button
                    variant="text"
                    size="small"
                    disabled={page + 1 >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    sx={{ color: page + 1 >= totalPages ? "#bdbdbd" : "#49a3f1" }}
                >
                  Sau
                </Button>
              </SoftBox>
            </SoftBox>
          </Card>

          {/* Modal Thêm/Sửa hình ảnh */}
          <Dialog open={showModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
            <DialogTitle>{editingImage ? "Sửa hình ảnh" : "Thêm hình ảnh"}</DialogTitle>
            <DialogContent>
              <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                <Input
                    placeholder="Mã ảnh"
                    name="maAnh"
                    value={formData.maAnh || ""}
                    disabled={!!editingImage}
                    onChange={handleChange}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <label
                    htmlFor="file-input"
                    style={{
                      background: "#fff",
                      display: "flex",
                      gap: 10,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      marginTop: 12,
                      borderRadius: 10,
                      border: "2px dashed rgb(171 202 255)",
                      color: "#444",
                      cursor: "pointer",
                      transition: "background 0.2s, border 0.2s",
                    }}
                >
                  <span style={{ fontWeight: 600, color: "#444" }}>Thả tệp vào đây</span>
                  hoặc
                  <input
                      type="file"
                      accept="image/*"
                      required={!editingImage}
                      id="file-input"
                      style={{ width: 350, maxWidth: "100%" }}
                      onChange={handleChange}
                  />
                  {previewImg && (
                      <img
                          src={previewImg}
                          alt="Preview"
                          style={{
                            marginTop: 10,
                            maxWidth: "100%",
                            maxHeight: 200,
                            objectFit: "contain",
                            borderRadius: 10,
                          }}
                      />
                  )}
                </label>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Input
                    placeholder="Mô tả"
                    name="moTa"
                    value={formData.moTa || ""}
                    onChange={handleChange}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <label>
                  <input
                      type="checkbox"
                      name="anhMacDinh"
                      checked={formData.anhMacDinh}
                      onChange={handleChange}
                      style={{ marginRight: 8 }}
                  />
                  Ảnh mặc định
                </label>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Select
                    name="trangThai"
                    value={formData.trangThai}
                    onChange={handleChange}
                    size="small"
                >
                  <MenuItem value="Hiển thị">Hiển thị</MenuItem>
                  <MenuItem value="Ẩn">Ẩn</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleCloseModal}>
                Đóng
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Lưu
              </Button>
            </DialogActions>
          </Dialog>
        </SoftBox>
        <Footer />
      </DashboardLayout>
  );
}

export default ImageTable;