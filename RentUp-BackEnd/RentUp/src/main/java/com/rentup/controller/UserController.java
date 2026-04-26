package com.rentup.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import com.rentup.security.JwtUtil;
import com.rentup.dto.UserDTO;
import com.rentup.repository.UserRepository;
import com.rentup.request.ChangePasswordRequest;
import com.rentup.request.UserLoginRequest;
import com.rentup.services.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;



@RestController
@CrossOrigin
@RequestMapping("/users") 
public class UserController {

	@Autowired
	private UserService userService;
	@Autowired
	private UserRepository repo ;
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private AuthenticationManager authenticationManager;
	

	

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/all")
	public ResponseEntity<?> getAllUsers(){
		return ResponseEntity.ok(userService.getAllUsers()) ;
	}
	
	@PostMapping(value = "/register", consumes = "multipart/form-data")
	public ResponseEntity<?> addUser(
			@RequestPart("name") String name,@RequestPart("email") String email
			,@RequestPart("password") String password,
			@RequestPart("contactNumber") String contactNumber,
			@RequestPart("profilePhoto") MultipartFile profilePicture
	) throws Exception {
			UserDTO userDTO = new UserDTO();
			userDTO.setName(name);
			userDTO.setPassword(password);
			userDTO.setEmail(email);
			userDTO.setContactNumber(contactNumber);
			return ResponseEntity.
					status(HttpStatus.CREATED).
					body(userService.addUser(userDTO,profilePicture));
	}


	@GetMapping(value = "/profile/{mobileNumber}")
	public ResponseEntity<?> getProfilePicture(@PathVariable String mobileNumber){
		return ResponseEntity.status(HttpStatus.OK).body(userService.getProfilePicture(mobileNumber));
	}
	

	@PostMapping(value = "/login")
	public ResponseEntity<?> loginUser(@RequestBody UserLoginRequest loginRequest) throws IOException, Exception {
		try {
			Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getMobileNumber(), loginRequest.getPassword())
			);
			UserDTO user = userService.getUserByMobileNumber(loginRequest.getMobileNumber());
			String token = jwtUtil.generateToken(user.getContactNumber());
			Map<String, Object> response = new HashMap<>();
			response.put("token", token);
			response.put("user", user);
			return ResponseEntity.ok(response);
		} catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@GetMapping("/{mobileNumber}")
	public ResponseEntity<?> getUserByMobileNumber(@PathVariable String mobileNumber){
		return ResponseEntity.status(HttpStatus.OK).body(userService.getUserByMobileNumber(mobileNumber));
	}
	
	@GetMapping("/byId/{userId}")
	public ResponseEntity<?> getUserById(@PathVariable int userId){
		
		return ResponseEntity.status(HttpStatus.OK).body(repo.findById(userId));
	}

	


	@PostMapping("/create_order")
	@ResponseBody
	public String createOrder(@RequestBody String data) throws RazorpayException {
		JSONObject jsonData = new JSONObject(data);
		int amount = jsonData.getInt("price");
		var client = new RazorpayClient("rzp_test_c3HAknCruxSgid","we0dLWDuEcKL4QyJ02kpv4NK");
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("amount",amount*100);
		jsonObject.put("currency","INR");
		jsonObject.put("receipt","txn_235425");

		Order create = client.orders.create(jsonObject);

		return create.toString();
	}


	@GetMapping("/subscription_type/{mobileNumber}")
	public String getSubsricptionType(@PathVariable String mobileNumber){
		return userService.getSubscriptionType(mobileNumber);
	}
	
	@PutMapping("{userId}")
	public ResponseEntity<?> updateUserProfile(@PathVariable Integer userId,
											   @RequestParam("userName") String userName,
											   @RequestParam("userEmail") String userEmail
											  ) throws Exception {
		UserDTO userDTO = userService.updateUser(userId, userName,userEmail);
		System.out.println(userDTO);
		return ResponseEntity.ok(userDTO);

	}

	@PutMapping("/subscription/{mobileNumber}/{planType}")
	public ResponseEntity<?> updateSubscription(@PathVariable String mobileNumber,@PathVariable String planType){
		return ResponseEntity.status(HttpStatus.ACCEPTED).body(userService.updateSubscription(mobileNumber,planType));
	}

	@GetMapping("/{mobileNumber}/properties")
	public ResponseEntity<?> getUsersPropertiesLeft(@PathVariable String mobileNumber){
		System.out.println(mobileNumber);
		return null;
	}
	
	@PutMapping("/{mobileNumber}/{newPass}")
	public ResponseEntity<?> updatePassWord(@PathVariable String mobileNumber,@PathVariable String newPass){
		String message = userService.changePassword(mobileNumber,newPass);
		if (message.equals("Password updated successfully")) {
			return ResponseEntity.ok(message);
		} else {
			return ResponseEntity.badRequest().body(message);
		}
	}

	@PostMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
		String message = userService.changePassword(request);
		if (message.equals("Password changed successfully")) {
			return ResponseEntity.ok(message);
		} else {
			return ResponseEntity.badRequest().body(message);
		}
	}

	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{userId}")
	public ResponseEntity<?> deleteUser(@PathVariable Integer userId) {
		userService.deleteUser(userId);
		return ResponseEntity.ok("User deleted successfully");
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/role/{userId}")
	public ResponseEntity<?> updateUserRole(@PathVariable Integer userId, @RequestParam String role) {
		try {
			com.rentup.entities.Role userRole = com.rentup.entities.Role.valueOf(role.toUpperCase());
			userService.updateUserRole(userId, userRole);
			return ResponseEntity.ok("User role updated successfully");
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body("Invalid role");
		}
	}

}
