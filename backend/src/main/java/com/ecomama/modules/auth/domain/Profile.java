package com.ecomama.modules.auth.domain;

import com.ecomama.shared.domain.ValueObject;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Profile implements ValueObject {

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String bio;
    private String avatarUrl;
    private String city;
    private String country;
    
    @Builder.Default
    private String preferredLocale = "en";

    public String getFullName() {
        if (firstName == null && lastName == null) {
            return null;
        }
        if (firstName == null) {
            return lastName;
        }
        if (lastName == null) {
            return firstName;
        }
        return firstName + " " + lastName;
    }
}
