package com.rentup.services;

import java.io.IOException;
import java.util.List;

import com.rentup.dto.UserDTO;
import com.rentup.entities.User;
import com.rentup.request.ChangePasswordRequest;
import com.rentup.entities.Role;
import org.springframework.web.multipart.MultipartFile;



public interface UserService {
	UserDTO addUser(UserDTO userObject, MultipartFile profilePicture) throws Exception ;
	UserDTO loginUser(String mobileNumber, String password) throws IOException, Exception;

	User findById(Integer userId);
	UserDTO updateUser(Integer userId, String userName, String userEmail) throws Exception ;
	List<UserDTO> getAllUsers();

	String getSubscriptionType(String mobileNumber);

	Boolean updateSubscription(String mobileNumber,String planType);

	UserDTO getUserByMobileNumber(String mobileNumber);

	String changePassword(String mobileNumber, String newPass);

	String changePassword(ChangePasswordRequest request);

	void deleteUser(Integer userId);

	void updateUserRole(Integer userId, Role role);

	byte[] getProfilePicture(String mobileNumber);
}

