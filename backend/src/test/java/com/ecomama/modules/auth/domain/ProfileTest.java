package com.ecomama.modules.auth.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Profile Value Object Tests")
class ProfileTest {
    
    @Test
    @DisplayName("Should return full name when both first and last names are present")
    void shouldReturnFullNameWhenBothNamesPresent() {
        Profile profile = Profile.builder()
                .firstName("John")
                .lastName("Doe")
                .build();
        
        assertThat(profile.getFullName()).isEqualTo("John Doe");
    }
    
    @Test
    @DisplayName("Should return first name only when last name is null")
    void shouldReturnFirstNameWhenLastNameIsNull() {
        Profile profile = Profile.builder()
                .firstName("John")
                .build();
        
        assertThat(profile.getFullName()).isEqualTo("John");
    }
    
    @Test
    @DisplayName("Should return last name only when first name is null")
    void shouldReturnLastNameWhenFirstNameIsNull() {
        Profile profile = Profile.builder()
                .lastName("Doe")
                .build();
        
        assertThat(profile.getFullName()).isEqualTo("Doe");
    }
    
    @Test
    @DisplayName("Should return null when both names are null")
    void shouldReturnNullWhenBothNamesAreNull() {
        Profile profile = Profile.builder().build();
        
        assertThat(profile.getFullName()).isNull();
    }
    
    @Test
    @DisplayName("Should create profile with all fields")
    void shouldCreateProfileWithAllFields() {
        Profile profile = Profile.builder()
                .firstName("John")
                .lastName("Doe")
                .phoneNumber("+1234567890")
                .bio("Software Developer")
                .avatarUrl("https://example.com/avatar.jpg")
                .city("New York")
                .country("USA")
                .build();
        
        assertThat(profile.getFirstName()).isEqualTo("John");
        assertThat(profile.getLastName()).isEqualTo("Doe");
        assertThat(profile.getPhoneNumber()).isEqualTo("+1234567890");
        assertThat(profile.getBio()).isEqualTo("Software Developer");
        assertThat(profile.getAvatarUrl()).isEqualTo("https://example.com/avatar.jpg");
        assertThat(profile.getCity()).isEqualTo("New York");
        assertThat(profile.getCountry()).isEqualTo("USA");
    }
    
    @Test
    @DisplayName("Should verify value object equality")
    void shouldVerifyValueObjectEquality() {
        Profile profile1 = Profile.builder()
                .firstName("John")
                .lastName("Doe")
                .build();
        
        Profile profile2 = Profile.builder()
                .firstName("John")
                .lastName("Doe")
                .build();
        
        assertThat(profile1).isEqualTo(profile2);
        assertThat(profile1.hashCode()).isEqualTo(profile2.hashCode());
    }
}
