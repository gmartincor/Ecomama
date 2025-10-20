package com.ecomama.modules.auth.presentation.mapper;

import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.presentation.dto.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProfileMapper.class})
public interface UserMapper {
    
    @Mapping(target = "role", expression = "java(user.getRole().name())")
    UserResponse toUserResponse(User user);
    
    List<UserResponse> toUserResponseList(List<User> users);
}
