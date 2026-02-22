package com.school.saas.module.subscription;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-22T18:22:25+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260128-0750, environment: Java 21.0.9 (Eclipse Adoptium)"
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

        planFeature.enabled( planFeatureDTO.getEnabled() );
        planFeature.featureType( planFeatureDTO.getFeatureType() );

        return planFeature.build();
    }
}
