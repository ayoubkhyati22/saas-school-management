package com.school.saas.common;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.postgresql.util.PGobject;

import java.sql.SQLException;

@Converter
public class JsonbConverter implements AttributeConverter<String, Object> {

    @Override
    public Object convertToDatabaseColumn(String attribute) {
        try {
            PGobject pgObject = new PGobject();
            pgObject.setType("jsonb");

            // Si null ou vide, utiliser un tableau JSON vide
            if (attribute == null || attribute.trim().isEmpty()) {
                pgObject.setValue("[]");
            } else {
                pgObject.setValue(attribute);
            }

            return pgObject;
        } catch (SQLException e) {
            throw new IllegalArgumentException("Failed to convert String to JSONB", e);
        }
    }

    @Override
    public String convertToEntityAttribute(Object dbData) {
        if (dbData == null) {
            return "[]";
        }

        if (dbData instanceof PGobject) {
            String value = ((PGobject) dbData).getValue();
            return value != null ? value : "[]";
        }

        return dbData.toString();
    }
}

