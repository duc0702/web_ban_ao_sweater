package org.example.webbanao.exception;


import jakarta.validation.ConstraintViolation;
import lombok.extern.slf4j.Slf4j;
import org.example.webbanao.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;

@Slf4j
@ControllerAdvice
public class GlobalException {
    private static final String MIN_ATTRIBUTE = "min";

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse> runtimeExceptionHandler(Exception e) {
        log.error("Unhandled exception caught by GlobalExceptionHandler: {}", e.getMessage(), e); // Log lỗi chi tiết hơn
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getErrorCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getErrorMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
    }

    // Xử lý các AppException tùy chỉnh của bạn
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> appExceptionHandler(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        log.error("AppException caught: Code={}, Message={}", errorCode.getErrorCode(), errorCode.getErrorMessage());
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(errorCode.getErrorCode());
        apiResponse.setMessage(errorCode.getErrorMessage());
        // Có thể thêm data nếu cần, ví dụ: apiResponse.setData(null);
        return ResponseEntity.status(errorCode.getHttpStatus()).body(apiResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        // Sử dụng một ErrorCode cho lỗi validation
        ErrorCode validationError = ErrorCode.VALIDATION_ERROR; // Bạn cần định nghĩa cái này
        ApiResponse<Map<String, String>> response  = ApiResponse.<Map<String, String>>builder()
                .code(validationError.getErrorCode())
                .message(validationError.getErrorMessage())
                .data(errors) // Trả về chi tiết lỗi validation
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST); // HTTP 400 Bad Request
    }



}
