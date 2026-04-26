package com.rentup.services;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import com.rentup.dto.UserDTO;
import com.rentup.entities.User;
import com.rentup.entities.UserProfilePicture;
import com.rentup.exception.ResourceNotFoundException;
import com.rentup.repository.UserProfilePictureRepository;
import com.rentup.repository.UserRepository;
import com.rentup.entities.Role;
import com.rentup.request.ChangePasswordRequest;
import com.rentup.strategy.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private UserProfilePictureRepository userProfilePictureRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private UserProfilePictureRepository profilePictureRepository;

	@Override
	public UserDTO addUser(UserDTO request, MultipartFile profilePicture) throws Exception {
		
		User userByMobile  = userRepository.findByContactNumber(request.getContactNumber());
		
		User userByEmail = userRepository.findByEmail(request.getEmail());
		
		if(userByMobile== null && userByEmail== null) {

		User user = mapper.map(request, User.class);

		UserProfilePicture profilePicture1 = new UserProfilePicture();

		profilePicture1.setUser(user);
		profilePicture1.setContent(profilePicture.getBytes());

		user.setPassword(passwordEncoder.encode(user.getPassword()));

		user.setPropertiesLeft(5);
		User savedUser = userRepository.save(user);
		userProfilePictureRepository.save(profilePicture1);
		return mapper.map(savedUser, UserDTO.class);
		}
		else {
			if(userByEmail !=null) {
				throw new Exception("Email already exists!!!");
			}
			if(userByMobile !=null) {
				throw new Exception("Mobile number already exists!!!!!");
			}
			return null;
		}
	}

	@Override
	public UserDTO loginUser(String mobileNumber, String password) throws IOException, Exception {
		User user = userRepository.findByContactNumber(mobileNumber);

		if (user != null && passwordEncoder.matches(password, user.getPassword())) {
			UserDTO returning = mapper.map(user, UserDTO.class);
//			UserProfilePicture profilePicture = profilePictureRepository.findByUser(user);
//			returning.setProfilePicture(profilePicture.getContent());
			return returning;
		}
		return null; // Login failed
	}

	@Override
	public byte[] getProfilePicture(String mobileNumber) {
		User user = userRepository.findByContactNumber(mobileNumber);
		UserProfilePicture profilePicture = profilePictureRepository.findByUser(user);
		return profilePicture.getContent();
	}


	@Override
    public String changePassword(ChangePasswordRequest request) {
        // Retrieve the user by userId
        User user = userRepository.findByContactNumber(request.getContactNumber());
        if (user == null) {
            // User not found
            return "User not found";
        }

        // Verify the old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            // Incorrect old password
            return "Incorrect old password";
        }

        // Validate new password
        if (request.getNewPassword().equals(request.getOldPassword())) {
            return "New password cannot be the same as old password";
        }
        if (request.getNewPassword().length() < 6) {
            return "Password must be at least 6 characters long";
        }

        // Update the user's password with the new one
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully";
    }

	@Override
	public User findById(Integer userId) {

		return userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

	}

	@Override
	public UserDTO updateUser(Integer userId, String userName, String userEmail) throws Exception {
		User user = userRepository.findById(userId).orElseThrow();

//		if(user.getEmail().equalsIgnoreCase(userEmail)) {
//			throw new Exception("Email already registered!!!!");
//		}
		user.setEmail(userEmail);
		user.setName(userName);
//		byte[] userProfilePictureBytes = null;
//		try {
//			if (userProfilePicture != null) {
//				userProfilePictureBytes = userProfilePicture.getBytes();
//			}
//		} catch (IOException e) {
//			System.out.println(e.getMessage());
//			e.printStackTrace();
//		}
//		 user.setProfilePicture(null);
		return mapper.map(userRepository.save(user), UserDTO.class);

	}

	@Override
	public List<UserDTO> getAllUsers() {
		List<User> users = userRepository.findAll();
		// List<UserDTO> userDTOList =
		// users.stream().map(user->customMapper.mapUserToDTO(user)).toList();
		// return userDTOList;
		return null;
	}

	@Override
	public String getSubscriptionType(String mobileNumber) {
		User user = userRepository.findByContactNumber(mobileNumber);
		if (!(isSubscriptionLeft(user))) {
			user.setPropertiesLeft(5);
			user.setSubscriptionStartDate(null);
			user.setSubscriptionEndDate(null);
			user.setSubscriptionType(null);
			userRepository.save(user);
		}
		return user.getSubscriptionType();
	}

	public boolean isSubscriptionLeft(User user) {
		Date endDate = user.getSubscriptionEndDate();
		LocalDate currDate = LocalDate.now();
		if (currDate.isAfter(endDate.toLocalDate())) {
			return false;
		}
		return true;
	}

	@Override
	public Boolean updateSubscription(String mobileNumber, String planType) {
		User userEntity = userRepository.findByContactNumber(mobileNumber);
		userEntity.setSubscriptionType(planType.toUpperCase());

		SubscriptionContext context = new SubscriptionContext();
		SubscriptionStrategy strategy;
		if (planType.equalsIgnoreCase("silver")) {
			strategy = new SilverStrategy();
		} else if (planType.equalsIgnoreCase("gold")) {
			strategy = new GoldStrategy();
		} else {
			strategy = new PlatinumStrategy();
		}
		context.setStrategy(strategy);

		userEntity.setPropertiesLeft(context.getPropertiesLeft());

		LocalDate startDate = LocalDate.now();
		Date sqlStartDate = Date.valueOf(startDate);
		Date sqlEndDate = Date.valueOf(context.getEndDate(startDate));
		userEntity.setSubscriptionStartDate(sqlStartDate);
		userEntity.setSubscriptionEndDate(sqlEndDate);
		userRepository.save(userEntity);
		return true;
	}

	@Override
	public UserDTO getUserByMobileNumber(String mobileNumber) {
		User user = userRepository.findByContactNumber(mobileNumber);
		if(user == null){
			return null;
		}
		return mapper.map(user, UserDTO.class);
	}

	@Override
	public String changePassword(String mobileNumber, String newPass) {
		User userEntity = userRepository.findByContactNumber(mobileNumber);
		if (userEntity == null) {
			return "User not found";
		}
		if (newPass.length() < 6) {
			return "Password must be at least 6 characters long";
		}
		userEntity.setPassword(passwordEncoder.encode(newPass));
		userRepository.save(userEntity);
		return "Password updated successfully";
	}



	@Override
	public void deleteUser(Integer userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		userRepository.delete(user);
	}

	@Override
	public void updateUserRole(Integer userId, Role role) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		user.setRole(role);
		userRepository.save(user);
	}

}
