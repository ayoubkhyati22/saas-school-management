package com.school.saas.module.parent;

import com.school.saas.common.BaseEntity;
import com.school.saas.module.user.User;
import com.school.saas.module.school.School;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(name = "parents", indexes = {
    @Index(name = "idx_parent_school_id", columnList = "school_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Parent extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "school_id", nullable = false, insertable = false, updatable = false)
    private UUID schoolId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @Column(name = "occupation", length = 100)
    private String occupation;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;
}
