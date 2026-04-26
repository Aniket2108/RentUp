package com.rentup.services;

import com.rentup.entities.Area;
import com.rentup.entities.City;
import com.rentup.repository.AreaRepository;
import com.rentup.repository.CityRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AreaServiceImpl implements AreaService{

    @Autowired
    private AreaRepository areaRepo;

    @Autowired
    private CityRepository cityRepo;

    @Override
    public List<String> getAllAreas() {
        List<Area> areaEntities = areaRepo.findAll();
        List<String> areaNames = areaEntities.stream()
                .map(Area::getAreaName).collect(Collectors.toList());
        return areaNames;
    }

    @Override
    public List<String> getAreaByCityName(String cityName) {
        System.out.println("inputCity"+cityName);
        City city = cityRepo.findByCityNameIgnoreCase(cityName);
        System.out.println("City"+city);
        List<Area> areasEntity = areaRepo.findByCity(city);
        System.out.println("area"+areasEntity);
        List<String> areaNames = areasEntity.stream()
                .map(Area::getAreaName).collect(Collectors.toList());
        return areaNames;
    }
}

