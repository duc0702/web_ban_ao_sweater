package org.example.webbanao.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
@Getter
public enum ErrorCode {
    USER_EXISTED(1002, "User already existed",HttpStatus.INTERNAL_SERVER_ERROR),
    UNCATEGORIZED_EXCEPTION(9999, "UNCATEGORIZED_EXCEPTION",HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "USERNAME MUST BE AT LEAST {min} characters",HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004,"PASSWORD MUST BE AT LEAST {min} characters",HttpStatus.BAD_REQUEST),
    INSUFFICIENT_QUANTITY(1001, "Số lượng yêu cầu vượt quá số lượng tồn kho",HttpStatus.BAD_REQUEST),
    INVALID_DOB(1009, "Your must be at least {min}" ,HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_FOUND(1010, "Sản phẩm không tồn tại",HttpStatus.BAD_REQUEST),
    CUSTOMER_NOT_FOUND(1011, "Khách hàng không tồn tại",HttpStatus.BAD_REQUEST),
    EMPLOYEE_NOT_FOUND(1011, "Nhân viên không tồn tại",HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND(1005, "Hóa đơn không tồn tại", HttpStatus.NOT_FOUND),
    NO_STATUS_CHANGE(1006, "Trạng thái hóa đơn không thay đổi", HttpStatus.BAD_REQUEST),
    INVALID_STATUS_TRANSITION(1007, "Chuyển đổi trạng thái không hợp lệ", HttpStatus.BAD_REQUEST),
    ORDER_HAS_BEEN_CANCELLED(1008, "Đơn hàng đã hủy", HttpStatus.BAD_REQUEST),
    VALIDATION_ERROR(1008, "VALIDATION_ERROR", HttpStatus.BAD_REQUEST),


    ;
    private int errorCode;
    private String errorMessage;
    private HttpStatus httpStatus;

    ErrorCode(int errorCode, String errorMessage,HttpStatus httpStatus) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.httpStatus = httpStatus;
    }

    public int getErrorCode() {
        return errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}
