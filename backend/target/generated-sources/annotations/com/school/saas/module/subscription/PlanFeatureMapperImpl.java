package com.school.saas.module.subscription;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-12T11:17:33+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 19.0.1 (Oracle Corporation)"
)
@Component
public class PlanFeatureMapperImpl implements PlanFeatureMapper {

    @Override
    public PlanFeatureDTO toDTO(PlanFeature planFeature) {
        if ( planFeature == null ) {
            return null;
        }

        PlanFeatureDTO.PlanFeatureDTOBuilder planFeatureDTO = PlanFeatureDTO.builder();

        planFeatureDTO.id( planFeature.getId() );
        planFeatureDTO.featureType( planFeature.getFeatureType() );
        planFeatureDTO.enabled( planFeature.getEnabled() );

        return planFeatureDTO.build();
    }

    @Override
    public PlanFeature toEntity(PlanFeatureDTO planFeatureDTO) {
        if ( planFeatureDTO == null ) {
            return null;
        }

        PlanFeature.PlanFeatureBuilder<?, ?> planFeature = PlanFeature.builder();

        planFeature.featureType( planFeatureDTO.getFeatureType() );
        planFeature.enabled( planFeatureDTO.getEnabled() );

        return planFeature.build();
    }
}
