package com.school.saas.common;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class JsonbConverter implements AttributeConverter<String, String> {

    @Override
    public String convertToDatabaseColumn(String attribute) {
        // Si null ou vide, utiliser un tableau JSON vide
        if (attribute == null || attribute.trim().isEmpty()) {
            return "[]";
        }
        return attribute;
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        // Retourner un tableau vide si null
        if (dbData == null || dbData.trim().isEmpty()) {
            return "[]";
        }
        return dbData;
    }
}

