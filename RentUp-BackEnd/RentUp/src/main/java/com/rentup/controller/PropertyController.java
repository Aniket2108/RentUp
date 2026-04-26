package com.rentup.controller;

import java.io.IOException;
import java.util.List;

import com.rentup.dto.PropertyDTO;
import com.rentup.dto.UserDTO;
import com.rentup.entities.PropertyStatus;
import com.rentup.request.PropertyRequest;
import com.rentup.services.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.multipart.MultipartFile;


@RestController
@CrossOrigin
@RequestMapping("/properties")
public class PropertyController {
    @Autowired
    private PropertyService propertyService;

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<PropertyDTO>> getAllProperties() {
        List<PropertyDTO> properties = propertyService.getAllProperties();
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }

    @PostMapping(value = "/add", consumes = "multipart/form-data")
    public ResponseEntity<?> addProperty(@RequestPart("flatType") String flatType,@RequestPart("area") String area,
                                         @RequestPart("address") String address,@RequestPart("preferredTenant") String preferredTenant,@RequestPart("areaId") String areaId,
                                         @RequestPart("price") String price,@RequestPart("userId") String userId,
                                         @RequestPart("propertyPhoto") MultipartFile propertyPhoto) throws IOException {

        PropertyRequest propertyRequest = new PropertyRequest();
        propertyRequest.setFlatType(flatType);
        propertyRequest.setArea(Double.parseDouble(area));
        propertyRequest.setAddress(address);
        propertyRequest.setPreferredTenant(preferredTenant);
        propertyRequest.setAreaId(areaId);
        propertyRequest.setPrice(Integer.parseInt(price));
        propertyRequest.setUserId(Integer.parseInt(userId));

        return ResponseEntity.status(HttpStatus.OK).body(propertyService.addProperty(propertyRequest,propertyPhoto));
    }



    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable Integer id) {
        PropertyDTO property = propertyService.getPropertyById(id);
        return new ResponseEntity<>(property, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<PropertyDTO> saveProperty(@RequestBody PropertyDTO propertyDTO) {
        PropertyDTO savedProperty = propertyService.saveProperty(propertyDTO);
        return new ResponseEntity<>(savedProperty, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Integer id) {
        propertyService.deleteProperty(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getPropertiesByUserId(@PathVariable  Integer userId) {
        List<PropertyDTO> properties = propertyService.getPropertiesByUserId(userId);
        
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }
    
    @PutMapping("/{propertyId}")
    public ResponseEntity<?> updatePropertyStatusToRented(@PathVariable Integer propertyId) {
       
            propertyService.updatePropertyStatusToRented(propertyId);
            return new ResponseEntity<>(HttpStatus.OK);
       
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePropertyStatus(@PathVariable Integer id, @RequestParam String status) {
        // Assuming PropertyService has a method to update status
        // For now, I'll add it
        propertyService.updatePropertyStatus(id, PropertyStatus.valueOf(status.toUpperCase()));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "/image/{propertyId}")
    public ResponseEntity<?> getPropertyImage(@PathVariable String propertyId){
        return ResponseEntity.status(HttpStatus.OK).body(propertyService.getPropertyPicture(Integer.parseInt(propertyId)));
    }
}

