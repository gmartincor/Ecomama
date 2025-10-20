package com.ecomama.modules.auth.presentation.mapper;

import com.ecomama.modules.auth.domain.Profile;
import com.ecomama.modules.auth.presentation.dto.ProfileResponse;
import com.ecomama.modules.auth.presentation.dto.UpdateProfileRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    
    ProfileResponse toProfileResponse(Profile profile);
    
    Profile toProfile(UpdateProfileRequest request);
}
