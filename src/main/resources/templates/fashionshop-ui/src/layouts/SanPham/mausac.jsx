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

const getTrangThaiText = (val) =>
    val === 1 || val === "1" || val === "Hiển thị" ? "Hiển thị" : "Ẩn";

function ColorTable() {
    // Query params state
    const [queryParams, setQueryParams] = useState({
        tenMauSac: "",
        trangThai: "Tất cả",
        page: 0,
        size: 5,
    });

    // Data/loading/error states
    const [colorsData, setColorsData] = useState({
        content: [],
        totalPages: 1,
        number: 0,
        first: true,
        last: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [newColor, setNewColor] = useState({
        maMau: "",
        tenMauSac: "",
        trangThai: "Hiển thị",
    });

    // Edit states
    const [editColor, setEditColor] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Delete states
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Menu states
    const [anchorEl, setAnchorEl] = useState(null);

    // Fetch colors from API
    useEffect(() => {
        setLoading(true);
        setError("");
        let url = `http://localhost:8080/mauSac?page=${queryParams.page}&size=${queryParams.size}`;
        if (queryParams.tenMauSac)
            url += `&tenMauSac=${encodeURIComponent(queryParams.tenMauSac)}`;
        if (queryParams.trangThai !== "Tất cả")
            url += `&trangThai=${queryParams.trangThai === "Hiển thị" ? 1 : 0}`;

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi khi tải dữ liệu màu sắc");
                return res.json();
            })
            .then((data) => setColorsData(data))
            .catch((err) => setError(err.message || "Lỗi không xác định"))
            .finally(() => setLoading(false));
    }, [queryParams]);

    // Handler for Add Color
    const handleAddColor = () => {
        if (!newColor.maMau || !newColor.tenMauSac) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        setLoading(true);
        fetch("http://localhost:8080/mauSac", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...newColor,
                trangThai: newColor.trangThai === "Hiển thị" ? 1 : 0,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi khi thêm màu sắc");
                return res.text();
            })
            .then(() => {
                setShowModal(false);
                setNewColor({ maMau: "", tenMauSac: "", trangThai: "Hiển thị" });
                setQueryParams({ ...queryParams, page: 0 });
            })
            .catch((err) => setError(err.message || "Lỗi không xác định"))
            .finally(() => setLoading(false));
    };

    // Handler for Edit Color
    const handleEditClick = (color) => {
        setEditColor({
            ...color,
            trangThai: getTrangThaiText(color.trangThai),
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (!editColor.maMau || !editColor.tenMauSac) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        setLoading(true);
        fetch(`http://localhost:8080/mauSac/${editColor.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...editColor,
                trangThai: editColor.trangThai === "Hiển thị" ? 1 : 0,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi khi cập nhật màu sắc");
                return res.text();
            })
            .then(() => {
                setShowEditModal(false);
                setEditColor(null);
                setQueryParams({ ...queryParams }); // reload lại danh sách
            })
            .catch((err) => setError(err.message || "Lỗi không xác định"))
            .finally(() => setLoading(false));
    };

    // Handler for Delete Color
    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteDialog(true);
    };
    const handleConfirmDelete = () => {
        setLoading(true);
        fetch(`http://localhost:8080/mauSac/${deleteId}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi khi xóa màu sắc");
                setShowDeleteDialog(false);
                setDeleteId(null);
                setQueryParams({ ...queryParams }); // reload lại danh sách
            })
            .catch((err) => setError(err.message || "Lỗi không xác định"))
            .finally(() => setLoading(false));
    };

    // Pagination
    const handlePageChange = (newPage) => {
        setQueryParams({ ...queryParams, page: newPage });
    };

    // Menu actions
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    // Table columns
    const columns = [
        { name: "stt", label: "STT", align: "center", width: "60px" },
        { name: "maMau", label: "Mã", align: "left", width: "100px" },
        { name: "tenMauSac", label: "Tên", align: "left", width: "180px" },
        {
            name: "trangThai",
            label: "Trạng thái",
            align: "center",
            width: "120px",
            render: (value) => (
                <span
                    style={{
                        background: getTrangThaiText(value) === "Hiển thị" ? "#e6f4ea" : "#f4f6fb",
                        color: getTrangThaiText(value) === "Hiển thị" ? "#219653" : "#bdbdbd",
                        border: `1px solid ${getTrangThaiText(value) === "Hiển thị" ? "#219653" : "#bdbdbd"}`,
                        borderRadius: 6,
                        fontWeight: 500,
                        padding: "2px 12px",
                        fontSize: 13,
                        display: "inline-block",
                        minWidth: 60,
                        textAlign: "center",
                    }}
                >
          {getTrangThaiText(value)}
        </span>
            ),
        },
        {
            name: "actions",
            label: "Thao tác",
            align: "center",
            width: "110px",
            render: (_, row) => (
                <SoftBox display="flex" gap={0.5} justifyContent="center">
                    <IconButton
                        size="small"
                        sx={{ color: "#4acbf2" }}
                        title="Sửa"
                        onClick={() => handleEditClick(row)}
                    >
                        <FaEdit />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ color: "#4acbf2" }}
                        title="Xóa"
                        onClick={() => handleDelete(row.id)}
                    >
                        <FaTrash />
                    </IconButton>
                </SoftBox>
            ),
        },
    ];

    const rows =
        colorsData.content && colorsData.content.length
            ? colorsData.content.map((color, idx) => ({
                ...color,
                stt: queryParams.page * queryParams.size + idx + 1,
            }))
            : [];

    // Modal Thêm màu sắc (có nút X góc phải)
    const renderAddColorModal = () => (
        <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth>
            <DialogTitle>
                Thêm mới màu sắc
                <IconButton
                    aria-label="close"
                    onClick={() => setShowModal(false)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    size="large"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                    <Input
                        placeholder="Mã màu sắc"
                        value={newColor.maMau}
                        onChange={(e) => setNewColor({ ...newColor, maMau: e.target.value })}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <Input
                        placeholder="Tên màu sắc"
                        value={newColor.tenMauSac}
                        onChange={(e) => setNewColor({ ...newColor, tenMauSac: e.target.value })}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <Select
                        value={newColor.trangThai}
                        onChange={(e) => setNewColor({ ...newColor, trangThai: e.target.value })}
                        size="small"
                    >
                        <MenuItem value="Hiển thị">Hiển thị</MenuItem>
                        <MenuItem value="Ẩn">Ẩn</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => setShowModal(false)} disabled={loading}>
                    Đóng
                </Button>
                <Button variant="contained" onClick={handleAddColor} disabled={loading}>
                    {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Modal sửa màu sắc (có nút X góc phải)
    const renderEditColorModal = () => (
        <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="xs" fullWidth>
            <DialogTitle>
                Sửa màu sắc
                <IconButton
                    aria-label="close"
                    onClick={() => setShowEditModal(false)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    size="large"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                    <Input
                        placeholder="Mã màu sắc"
                        value={editColor?.maMau || ""}
                        onChange={(e) => setEditColor({ ...editColor, maMau: e.target.value })}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <Input
                        placeholder="Tên màu sắc"
                        value={editColor?.tenMauSac || ""}
                        onChange={(e) => setEditColor({ ...editColor, tenMauSac: e.target.value })}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <Select
                        value={editColor?.trangThai || "Hiển thị"}
                        onChange={(e) => setEditColor({ ...editColor, trangThai: e.target.value })}
                        size="small"
                    >
                        <MenuItem value="Hiển thị">Hiển thị</MenuItem>
                        <MenuItem value="Ẩn">Ẩn</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleSaveEdit} disabled={loading}>
                    {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Dialog xác nhận xóa màu sắc
    const renderDeleteDialog = () => (
        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pr: 2,
                    fontWeight: 700,
                    fontSize: 20,
                    pb: 1,
                    pt: 2,
                }}
            >
                <span>Bạn chắc chắn muốn xóa màu sắc này?</span>
                <IconButton
                    aria-label="close"
                    onClick={() => setShowDeleteDialog(false)}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                        ml: 2,
                    }}
                    size="large"
                >
                    <CloseIcon sx={{ fontSize: 26 }} />
                </IconButton>
            </DialogTitle>
            <DialogActions sx={{ pb: 3, pt: 1, justifyContent: "center" }}>
                <Button
                    variant="outlined"
                    onClick={() => setShowDeleteDialog(false)}
                    disabled={loading}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 400,
                        color: "#49a3f1",
                        borderColor: "#49a3f1",
                        boxShadow: "none",
                        background: "#fff",
                        mr: 1.5,
                        "&:hover": {
                            borderColor: "#1769aa",
                            background: "#f0f6fd",
                            color: "#1769aa",
                        },
                        "&.Mui-disabled": {
                            color: "#49a3f1",
                            borderColor: "#49a3f1",
                            opacity: 0.7,
                            background: "#fff",
                        },
                    }}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirmDelete}
                    disabled={loading}
                    sx={{ borderRadius: 2, minWidth: 90, fontWeight: 500 }}
                >
                    {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}>
                {/* PHẦN 1: Card filter/search/action */}
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
                                placeholder="Tìm màu sắc"
                                value={queryParams.tenMauSac}
                                onChange={(e) =>
                                    setQueryParams({
                                        ...queryParams,
                                        tenMauSac: e.target.value,
                                        page: 0,
                                    })
                                }
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
                                    value={queryParams.trangThai}
                                    onChange={(e) =>
                                        setQueryParams({
                                            ...queryParams,
                                            trangThai: e.target.value,
                                            page: 0,
                                        })
                                    }
                                    size="small"
                                    displayEmpty
                                    sx={{ borderRadius: 2, background: "#f5f6fa", height: 40 }}
                                    inputProps={{ "aria-label": "Trạng thái" }}
                                >
                                    <MenuItem value="Tất cả">Tất cả</MenuItem>
                                    <MenuItem value="Hiển thị">Hiển thị</MenuItem>
                                    <MenuItem value="Ẩn">Ẩn</MenuItem>
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
                                    <span style={{ color: "#27ae60", marginRight: 8 }}>📥</span> Export Excel
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
                                onClick={() => setShowModal(true)}
                            >
                                Thêm màu sắc
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>

                {/* PHẦN 2: Card Table/Pagination */}
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <SoftBox>
                        <Table columns={columns} rows={rows} loading={loading} />
                    </SoftBox>
                    {/* Pagination + View */}
                    <SoftBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                        flexWrap="wrap"
                        gap={2}
                    >
                        <SoftBox>
                            <FormControl sx={{ minWidth: 120 }}>
                                <Select
                                    value={queryParams.size}
                                    onChange={(e) =>
                                        setQueryParams({
                                            ...queryParams,
                                            size: Number(e.target.value),
                                            page: 0,
                                        })
                                    }
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
                                disabled={colorsData.first}
                                onClick={() => handlePageChange(queryParams.page - 1)}
                                sx={{ color: colorsData.first ? "#bdbdbd" : "#49a3f1" }}
                            >
                                Trước
                            </Button>
                            {Array.from({ length: colorsData.totalPages || 1 }, (_, i) => (
                                <Button
                                    key={i + 1}
                                    variant={colorsData.number === i ? "contained" : "text"}
                                    color={colorsData.number === i ? "info" : "inherit"}
                                    size="small"
                                    onClick={() => handlePageChange(i)}
                                    sx={{
                                        minWidth: 32,
                                        borderRadius: 2,
                                        color: colorsData.number === i ? "#fff" : "#495057",
                                        background: colorsData.number === i ? "#49a3f1" : "transparent",
                                    }}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                            <Button
                                variant="text"
                                size="small"
                                disabled={colorsData.last}
                                onClick={() => handlePageChange(queryParams.page + 1)}
                                sx={{ color: colorsData.last ? "#bdbdbd" : "#49a3f1" }}
                            >
                                Sau
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>
                {renderAddColorModal()}
                {renderEditColorModal()}
                {renderDeleteDialog()}
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}

export default ColorTable;