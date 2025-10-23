package com.ecomama.shared.api.doc;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

public final class ApiDocumentation {
    
    private ApiDocumentation() {}
    
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request parameters or validation error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = com.ecomama.shared.api.ApiResponse.class),
                            examples = @ExampleObject(
                                    name = "Validation Error",
                                    value = """
                    {
                      "success": false,
                      "error": {
                        "code": "VALIDATION_ERROR",
                        "message": "Invalid request parameters",
                        "details": {
                          "email": "Invalid email format",
                          "password": "Password must be between 8 and 100 characters"
                        }
                      },
                      "timestamp": "2024-01-01T12:00:00Z"
                    }
                                    """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = com.ecomama.shared.api.ApiResponse.class),
                            examples = @ExampleObject(
                                    name = "Internal Error",
                                    value = """
                    {
                      "success": false,
                      "error": {
                        "code": "INTERNAL_ERROR",
                        "message": "An unexpected error occurred"
                      },
                      "timestamp": "2024-01-01T12:00:00Z"
                    }
                                    """
                            )
                    )
            )
    })
    public @interface StandardErrorResponses {}
    
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required or token invalid/expired",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = com.ecomama.shared.api.ApiResponse.class),
                            examples = @ExampleObject(
                                    name = "Unauthorized",
                                    value = """
                    {
                      "success": false,
                      "error": {
                        "code": "AUTHENTICATION_FAILED",
                        "message": "Authentication failed"
                      },
                      "timestamp": "2024-01-01T12:00:00Z"
                    }
                                    """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Access forbidden - insufficient permissions",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = com.ecomama.shared.api.ApiResponse.class),
                            examples = @ExampleObject(
                                    name = "Forbidden",
                                    value = """
                    {
                      "success": false,
                      "error": {
                        "code": "ACCESS_DENIED",
                        "message": "Access denied"
                      },
                      "timestamp": "2024-01-01T12:00:00Z"
                    }
                                    """
                            )
                    )
            )
    })
    public @interface AuthErrorResponses {}
    
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    @ApiResponse(
            responseCode = "404",
            description = "Resource not found",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = com.ecomama.shared.api.ApiResponse.class),
                    examples = @ExampleObject(
                            name = "Not Found",
                            value = """
                {
                  "success": false,
                  "error": {
                    "code": "RESOURCE_NOT_FOUND",
                    "message": "Resource not found"
                  },
                  "timestamp": "2024-01-01T12:00:00Z"
                            }
                            """
                    )
            )
    )
    public @interface NotFoundResponse {}
    
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    @ApiResponse(
            responseCode = "409",
            description = "Resource conflict - already exists or invalid state",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = com.ecomama.shared.api.ApiResponse.class),
                    examples = @ExampleObject(
                            name = "Conflict",
                            value = """
                {
                  "success": false,
                  "error": {
                    "code": "RESOURCE_CONFLICT",
                    "message": "Resource already exists"
                  },
                  "timestamp": "2024-01-01T12:00:00Z"
                            }
                            """
                    )
            )
    )
    public @interface ConflictResponse {}
}
