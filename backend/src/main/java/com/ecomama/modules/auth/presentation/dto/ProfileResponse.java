package com.ecomama.modules.auth.presentation.dto;

public record ProfileResponse(
        String firstName,
        String lastName,
        String phoneNumber,
        String bio,
        String avatarUrl,
        String city,
        String country
) {
}
