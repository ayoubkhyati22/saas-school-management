package com.school.saas.config;

import com.school.saas.common.*;
import com.school.saas.module.absence.entity.Absence;
import com.school.saas.module.absence.repository.AbsenceRepository;
import com.school.saas.module.chat.ChatMessage;
import com.school.saas.module.chat.repository.ChatMessageRepository;
import com.school.saas.module.classroom.ClassRoom;
import com.school.saas.module.classroom.repository.ClassRoomRepository;
import com.school.saas.module.course.Course;
import com.school.saas.module.course.repository.CourseRepository;
import com.school.saas.module.event.entity.Event;
import com.school.saas.module.event.entity.EventType;
import com.school.saas.module.event.repository.EventRepository;
import com.school.saas.module.issue.entity.Issue;
import com.school.saas.module.issue.entity.IssuePriority;
import com.school.saas.module.issue.entity.IssueStatus;
import com.school.saas.module.issue.entity.IssueType;
import com.school.saas.module.issue.repository.IssueRepository;
import com.school.saas.module.notification.entity.Notification;
import com.school.saas.module.notification.entity.NotificationType;
import com.school.saas.module.notification.repository.NotificationRepository;
import com.school.saas.module.parent.Parent;
import com.school.saas.module.parent.ParentStudent;
import com.school.saas.module.parent.repository.ParentRepository;
import com.school.saas.module.parent.repository.ParentStudentRepository;
import com.school.saas.module.payment.entity.Payment;
import com.school.saas.module.payment.entity.PaymentStatus;
import com.school.saas.module.payment.entity.PaymentType;
import com.school.saas.module.payment.repository.PaymentRepository;
import com.school.saas.module.school.School;
import com.school.saas.module.school.SchoolRepository;
import com.school.saas.module.student.Student;
import com.school.saas.module.student.repository.StudentRepository;
import com.school.saas.module.subscription.*;
import com.school.saas.module.teacher.Teacher;
import com.school.saas.module.teacher.repository.TeacherRepository;
import com.school.saas.module.timetable.Timetable;
import com.school.saas.module.timetable.repository.TimetableRepository;
import com.school.saas.module.user.User;
import com.school.saas.module.user.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.school.saas.module.speciality.Speciality;
import com.school.saas.module.speciality.repository.SpecialityRepository;
import com.school.saas.module.exam.*;
import com.school.saas.module.exam.repository.ExamRepository;
import com.school.saas.module.exam.repository.ExamResultRepository;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataLoader {

    // Services and Encoders
    private final PasswordEncoder passwordEncoder;

    // Repositories
    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final PlanFeatureRepository planFeatureRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final ParentStudentRepository parentStudentRepository;
    private final ClassRoomRepository classRoomRepository;
    private final CourseRepository courseRepository;
    private final AbsenceRepository absenceRepository;
    private final PaymentRepository paymentRepository;
    private final EventRepository eventRepository;
    private final NotificationRepository notificationRepository;
    private final IssueRepository issueRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final SpecialityRepository specialityRepository;
    private final TimetableRepository timetableRepository;
    private final ExamRepository examRepository;
    private final ExamResultRepository examResultRepository;


    @PostConstruct
    @Transactional
    public void loadTestData() {
        log.info("Starting test data initialization...");

        // Check if data already exists
        if (userRepository.findByEmail("admin@schoolsaas.com").isPresent()) {
            log.info("Test data already exists. Skipping initialization.");
            return;
        }

        try {
            // 1. Create Super Admin User
            User superAdmin = createSuperAdmin();
            log.info("Created super admin user");

            // 2. Create Subscription Plans
            List<SubscriptionPlan> plans = createSubscriptionPlans();
            log.info("Created {} subscription plans", plans.size());

            // 3. Create Schools
            List<School> schools = createSchools();
            log.info("Created {} schools", schools.size());

            // 4. Create Subscriptions
            List<Subscription> subscriptions = createSubscriptions(schools, plans);
            log.info("Created {} subscriptions", subscriptions.size());

            // 5. Create School Admins
            List<User> schoolAdmins = createSchoolAdmins(schools);
            log.info("Created {} school admins", schoolAdmins.size());

            List<Speciality> specialities = createSpecialities(schools);
            log.info("Created {} specialities", specialities.size());

            // 6. Create Teachers
            List<Teacher> teachers = createTeachers(schools, specialities);
            log.info("Created {} teachers", teachers.size());

            // 7. Create Classrooms
            List<ClassRoom> classRooms = createClassrooms(schools, teachers);
            log.info("Created {} classrooms", classRooms.size());

            // 8. Create Students
            List<Student> students = createStudents(schools, classRooms);
            log.info("Created {} students", students.size());

            // 9. Create Parents
            List<Parent> parents = createParents(schools);
            log.info("Created {} parents", parents.size());

            // 10. Link Parents to Students
            List<ParentStudent> parentStudents = linkParentsToStudents(parents, students);
            log.info("Created {} parent-student relationships", parentStudents.size());

            // 11. Create Courses
            List<Course> courses = createCourses(schools, classRooms, teachers, specialities);
            log.info("Created {} courses", courses.size());

            // 12. Create Absences
            List<Absence> absences = createAbsences(schools, students, courses, teachers);
            log.info("Created {} absences", absences.size());

            // 13. Create Payments
            List<Payment> payments = createPayments(schools, students);
            log.info("Created {} payments", payments.size());

            // 14. Create Events
            List<Event> events = createEvents(schools, schoolAdmins);
            log.info("Created {} events", events.size());

            // 15. Create Notifications
            List<Notification> notifications = createNotifications(schools, parents, students, teachers);
            log.info("Created {} notifications", notifications.size());

            // 16. Create Issues
            List<Issue> issues = createIssues(schools, schoolAdmins, superAdmin);
            log.info("Created {} issues", issues.size());

            // 17. Create Chat Messages
            List<ChatMessage> chatMessages = createChatMessages(schools, courses, students, teachers);
            log.info("Created {} chat messages", chatMessages.size());

            List<Timetable> timetables = createTimetables(schools, classRooms, teachers, courses, specialities);
            log.info("Created {} timetables", timetables.size());

            List<Exam> exams = createExams(schools, classRooms, teachers, courses, specialities);
            log.info("Created {} exams", exams.size());

            List<ExamResult> examResults = createExamResults(schools, exams, students, teachers);
            log.info("Created {} exam results", examResults.size());

            log.info("Test data initialization completed successfully!");
            logSummary();

        } catch (Exception e) {
            log.error("Error during test data initialization", e);
            throw new RuntimeException("Failed to initialize test data", e);
        }
    }

    private User createSuperAdmin() {
        User superAdmin = User.builder()
                .email("admin@schoolsaas.com")
                .password(passwordEncoder.encode("SuperAdmin@123"))
                .firstName("Super")
                .lastName("Admin")
                .role(Role.SUPER_ADMIN)
                .enabled(true)
                .build();
        return userRepository.save(superAdmin);
    }

    private List<SubscriptionPlan> createSubscriptionPlans() {
        List<SubscriptionPlan> plans = new ArrayList<>();

        // Basic Plan
        SubscriptionPlan basicPlan = SubscriptionPlan.builder()
                .name("Basic Plan")
                .description("Perfect for small schools getting started")
                .monthlyPrice(new BigDecimal("29.99"))
                .yearlyPrice(new BigDecimal("299.99"))
                .maxStudents(100)
                .maxTeachers(10)
                .maxStorageGb(5)
                .maxClasses(10)
                .active(true)
                .features(new ArrayList<>())
                .build();
        basicPlan = subscriptionPlanRepository.save(basicPlan);

        // Add Basic Plan Features
        planFeatureRepository.save(createPlanFeature(basicPlan, PlanFeatureType.CHAT));
        planFeatureRepository.save(createPlanFeature(basicPlan, PlanFeatureType.ANALYTICS_DASHBOARD));
        plans.add(basicPlan);

        // Standard Plan
        SubscriptionPlan standardPlan = SubscriptionPlan.builder()
                .name("Standard Plan")
                .description("For growing schools with advanced needs")
                .monthlyPrice(new BigDecimal("79.99"))
                .yearlyPrice(new BigDecimal("799.99"))
                .maxStudents(300)
                .maxTeachers(30)
                .maxStorageGb(20)
                .maxClasses(30)
                .active(true)
                .features(new ArrayList<>())
                .build();
        standardPlan = subscriptionPlanRepository.save(standardPlan);

        // Add Standard Plan Features
        planFeatureRepository.save(createPlanFeature(standardPlan, PlanFeatureType.CHAT));
        planFeatureRepository.save(createPlanFeature(standardPlan, PlanFeatureType.ANALYTICS_DASHBOARD));
        planFeatureRepository.save(createPlanFeature(standardPlan, PlanFeatureType.MOBILE_APP_ACCESS));
        planFeatureRepository.save(createPlanFeature(standardPlan, PlanFeatureType.CUSTOM_REPORTS));
        plans.add(standardPlan);

        // Premium Plan
        SubscriptionPlan premiumPlan = SubscriptionPlan.builder()
                .name("Premium Plan")
                .description("Enterprise solution with all features")
                .monthlyPrice(new BigDecimal("149.99"))
                .yearlyPrice(new BigDecimal("1499.99"))
                .maxStudents(1000)
                .maxTeachers(100)
                .maxStorageGb(100)
                .maxClasses(100)
                .active(true)
                .features(new ArrayList<>())
                .build();
        premiumPlan = subscriptionPlanRepository.save(premiumPlan);

        // Add Premium Plan Features (All features)
        planFeatureRepository.save(createPlanFeature(premiumPlan, PlanFeatureType.CHAT));
        planFeatureRepository.save(createPlanFeature(premiumPlan, PlanFeatureType.ANALYTICS_DASHBOARD));
        planFeatureRepository.save(createPlanFeature(premiumPlan, PlanFeatureType.MOBILE_APP_ACCESS));
        planFeatureRepository.save(createPlanFeature(premiumPlan, PlanFeatureType.CUSTOM_REPORTS));
        planFeatureRepository.save(createPlanFeature(premiumPlan, PlanFeatureType.VIDEO_CALL));
        planFeatureRepository.save(createPlanFeature(premiumPlan, PlanFeatureType.API_ACCESS));
        planFeatureRepository.save(createPlanFeature(premiumPlan, PlanFeatureType.PRIORITY_SUPPORT));
        plans.add(premiumPlan);

        return plans;
    }

    private List<Speciality> createSpecialities(List<School> schools) {
        List<Speciality> specialities = new ArrayList<>();

        // School 1 Specialities - Green Valley High School
        specialities.add(createSpeciality(schools.get(0), "Mathematics", "MATH", "Mathematical sciences including algebra, geometry, and calculus"));
        specialities.add(createSpeciality(schools.get(0), "Physics", "PHYS", "Physical sciences and mechanics"));
        specialities.add(createSpeciality(schools.get(0), "Chemistry", "CHEM", "Chemical sciences and laboratory work"));
        specialities.add(createSpeciality(schools.get(0), "Biology", "BIO", "Life sciences and natural studies"));
        specialities.add(createSpeciality(schools.get(0), "English Literature", "ENG", "English language and literature studies"));
        specialities.add(createSpeciality(schools.get(0), "History", "HIST", "Historical studies and social sciences"));
        specialities.add(createSpeciality(schools.get(0), "Geography", "GEO", "Physical and human geography"));
        specialities.add(createSpeciality(schools.get(0), "Computer Science", "CS", "Programming and information technology"));
        specialities.add(createSpeciality(schools.get(0), "Physical Education", "PE", "Sports and physical activities"));
        specialities.add(createSpeciality(schools.get(0), "Art", "ART", "Visual arts and creative expression"));

        // School 2 Specialities - Sunshine Academy
        specialities.add(createSpeciality(schools.get(1), "Mathematics", "MATH", "Mathematical sciences"));
        specialities.add(createSpeciality(schools.get(1), "Science", "SCI", "General sciences"));
        specialities.add(createSpeciality(schools.get(1), "English", "ENG", "English language studies"));
        specialities.add(createSpeciality(schools.get(1), "Physical Education", "PE", "Sports and fitness"));
        specialities.add(createSpeciality(schools.get(1), "Music", "MUS", "Music theory and practice"));

        return specialities;
    }

    private Speciality createSpeciality(School school, String name, String code, String description) {
        Speciality speciality = Speciality.builder()
                .schoolId(school.getId())
                .name(name)
                .code(code)
                .description(description)
                .active(true)
                .build();
        return specialityRepository.save(speciality);
    }


    private PlanFeature createPlanFeature(SubscriptionPlan plan, PlanFeatureType featureType) {
        return PlanFeature.builder()
                .subscriptionPlan(plan)
                .featureType(featureType)
                .enabled(true)
                .build();
    }

    private List<School> createSchools() {
        List<School> schools = new ArrayList<>();

        School greenValley = School.builder()
                .name("Green Valley High School")
                .address("123 Main St, New York")
                .email("contact@greenvalley.edu")
                .phone("+1234567890")
                .active(true)
                .registrationDate(LocalDate.of(2024, 1, 1))
                .build();
        schools.add(schoolRepository.save(greenValley));

        School sunshine = School.builder()
                .name("Sunshine Academy")
                .address("456 Oak Ave, California")
                .email("info@sunshine.edu")
                .phone("+0987654321")
                .active(true)
                .registrationDate(LocalDate.of(2024, 6, 1))
                .build();
        schools.add(schoolRepository.save(sunshine));

        return schools;
    }

    private List<Subscription> createSubscriptions(List<School> schools, List<SubscriptionPlan> plans) {
        List<Subscription> subscriptions = new ArrayList<>();

        // School 1: Standard Plan (Yearly)
        Subscription sub1 = Subscription.builder()
                .school(schools.get(0))
                .subscriptionPlan(plans.get(1)) // Standard Plan
                .billingCycle(BillingCycle.YEARLY)
                .startDate(LocalDate.of(2024, 1, 1))
                .endDate(LocalDate.of(2025, 1, 1))
                .status(SubscriptionStatus.ACTIVE)
                .autoRenew(true)
                .build();
        subscriptions.add(subscriptionRepository.save(sub1));

        // School 2: Basic Plan (Monthly)
        Subscription sub2 = Subscription.builder()
                .school(schools.get(1))
                .subscriptionPlan(plans.get(0)) // Basic Plan
                .billingCycle(BillingCycle.MONTHLY)
                .startDate(LocalDate.of(2024, 6, 1))
                .endDate(LocalDate.of(2024, 12, 1))
                .status(SubscriptionStatus.ACTIVE)
                .autoRenew(true)
                .build();
        subscriptions.add(subscriptionRepository.save(sub2));

        return subscriptions;
    }

    private List<User> createSchoolAdmins(List<School> schools) {
        List<User> admins = new ArrayList<>();

        User admin1 = User.builder()
                .schoolId(schools.get(0).getId())
                .email("admin@greenvalley.edu")
                .password(passwordEncoder.encode("SchoolAdmin@123"))
                .firstName("John")
                .lastName("Smith")
                .role(Role.SCHOOL_ADMIN)
                .enabled(true)
                .build();
        admins.add(userRepository.save(admin1));

        User admin2 = User.builder()
                .schoolId(schools.get(1).getId())
                .email("admin@sunshine.edu")
                .password(passwordEncoder.encode("SchoolAdmin@123"))
                .firstName("Jane")
                .lastName("Doe")
                .role(Role.SCHOOL_ADMIN)
                .enabled(true)
                .build();
        admins.add(userRepository.save(admin2));

        return admins;
    }

    private List<Teacher> createTeachers(List<School> schools, List<Speciality> specialities) {
        List<Teacher> teachers = new ArrayList<>();

        // Find specialities for school 1
        Speciality mathSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("MATH"))
                .findFirst().orElse(null);
        Speciality engSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("ENG"))
                .findFirst().orElse(null);
        Speciality physSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("PHYS"))
                .findFirst().orElse(null);

        // School 1 Teachers
        teachers.add(createTeacher(schools.get(0), "math.teacher@greenvalley.edu", "Robert", "Johnson",
                mathSpec, "EMP001"));
        teachers.add(createTeacher(schools.get(0), "english.teacher@greenvalley.edu", "Emily", "Williams",
                engSpec, "EMP002"));
        teachers.add(createTeacher(schools.get(0), "science.teacher@greenvalley.edu", "David", "Brown",
                physSpec, "EMP003"));

        // Find specialities for school 2
        Speciality sciSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(1).getId()) && s.getCode().equals("SCI"))
                .findFirst().orElse(null);

        // School 2 Teachers
        teachers.add(createTeacher(schools.get(1), "physics.teacher@sunshine.edu", "Michael", "Davis",
                physSpec, "EMP001"));
        teachers.add(createTeacher(schools.get(1), "chemistry.teacher@sunshine.edu", "Sarah", "Wilson",
                sciSpec, "EMP002"));

        return teachers;
    }


    private Teacher createTeacher(School school, String email, String firstName, String lastName,
                                  Speciality speciality, String employeeNumber) {
        User user = User.builder()
                .schoolId(school.getId())
                .email(email)
                .password(passwordEncoder.encode("Teacher@123"))
                .firstName(firstName)
                .lastName(lastName)
                .role(Role.TEACHER)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        Teacher teacher = Teacher.builder()
                .user(user)
                .school(school)
                .speciality(speciality)
                .hireDate(LocalDate.of(2024, 1, 15))
                .employeeNumber(employeeNumber)
                .status(TeacherStatus.ACTIVE)
                .salary(new BigDecimal("50000.00"))
                .build();
        return teacherRepository.save(teacher);
    }


    private List<ClassRoom> createClassrooms(List<School> schools, List<Teacher> teachers) {
        List<ClassRoom> classRooms = new ArrayList<>();

        // School 1 Classrooms
        classRooms.add(createClassroom(schools.get(0), "Grade 9-A", "Grade 9", "A", 30, teachers.get(0)));
        classRooms.add(createClassroom(schools.get(0), "Grade 10-B", "Grade 10", "B", 30, teachers.get(1)));
        classRooms.add(createClassroom(schools.get(0), "Grade 11-A", "Grade 11", "A", 25, teachers.get(2)));

        // School 2 Classrooms
        classRooms.add(createClassroom(schools.get(1), "Grade 8-A", "Grade 8", "A", 25, teachers.get(3)));
        classRooms.add(createClassroom(schools.get(1), "Grade 9-B", "Grade 9", "B", 30, teachers.get(4)));

        return classRooms;
    }

    private ClassRoom createClassroom(School school, String name, String level, String section,
                                      int capacity, Teacher teacher) {
        ClassRoom classRoom = ClassRoom.builder()
                .schoolId(school.getId())
                .name(name)
                .level(level)
                .section(section)
                .academicYear("2024-2025")
                .capacity(capacity)
                .classTeacher(teacher)
                .build();
        return classRoomRepository.save(classRoom);
    }

    private List<Student> createStudents(List<School> schools, List<ClassRoom> classRooms) {
        List<Student> students = new ArrayList<>();

        // School 1 Students - Green Valley Elementary
        // Classroom 0 (Grade 9)
        students.add(createStudent(schools.get(0), classRooms.get(0), "alice.student@greenvalley.edu",
                "Alice", "Anderson", "STU2024001", LocalDate.of(2009, 5, 15), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "bob.student@greenvalley.edu",
                "Bob", "Baker", "STU2024002", LocalDate.of(2009, 7, 22), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "oliver.student@greenvalley.edu",
                "Oliver", "Miller", "STU2024006", LocalDate.of(2009, 6, 14), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "sophia.student@greenvalley.edu",
                "Sophia", "Wilson", "STU2024007", LocalDate.of(2009, 8, 21), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "noah.student@greenvalley.edu",
                "Noah", "Moore", "STU2024008", LocalDate.of(2009, 4, 3), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "isabella.student@greenvalley.edu",
                "Isabella", "Taylor", "STU2024009", LocalDate.of(2009, 9, 17), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "liam.student@greenvalley.edu",
                "Liam", "Anderson", "STU2024010", LocalDate.of(2009, 2, 28), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "mia.student@greenvalley.edu",
                "Mia", "Thomas", "STU2024011", LocalDate.of(2009, 11, 5), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "ethan.student@greenvalley.edu",
                "Ethan", "Jackson", "STU2024012", LocalDate.of(2009, 7, 19), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "ava.student@greenvalley.edu",
                "Ava", "White", "STU2024013", LocalDate.of(2009, 3, 25), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "james.student@greenvalley.edu",
                "James", "Harris", "STU2024014", LocalDate.of(2009, 10, 8), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "emily.student@greenvalley.edu",
                "Emily", "Martin", "STU2024015", LocalDate.of(2009, 1, 12), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "samuel.student@greenvalley.edu",
                "Samuel", "Turner", "STU2024041", LocalDate.of(2009, 5, 11), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "layla.student@greenvalley.edu",
                "Layla", "Diaz", "STU2024042", LocalDate.of(2009, 9, 28), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "wyatt.student@greenvalley.edu",
                "Wyatt", "Reyes", "STU2024047", LocalDate.of(2009, 7, 29), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "lily.student@greenvalley.edu",
                "Lily", "Stewart", "STU2024048", LocalDate.of(2009, 11, 11), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "nathan.student@greenvalley.edu",
                "Nathan", "Rogers", "STU2024053", LocalDate.of(2009, 10, 4), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "stella.student@greenvalley.edu",
                "Stella", "Morgan", "STU2024054", LocalDate.of(2009, 2, 16), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "gabriel.student@greenvalley.edu",
                "Gabriel", "Bell", "STU2024059", LocalDate.of(2009, 1, 30), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "aurora.student@greenvalley.edu",
                "Aurora", "Gomez", "STU2024060", LocalDate.of(2009, 6, 8), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "anthony.student@greenvalley.edu",
                "Anthony", "Richardson", "STU2024065", LocalDate.of(2009, 4, 14), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "lucy.student@greenvalley.edu",
                "Lucy", "Watson", "STU2024066", LocalDate.of(2009, 8, 27), Gender.FEMALE));

        // Classroom 1 (Grade 10)
        students.add(createStudent(schools.get(0), classRooms.get(1), "charlie.student@greenvalley.edu",
                "Charlie", "Clark", "STU2024003", LocalDate.of(2008, 3, 10), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "diana.student@greenvalley.edu",
                "Diana", "Davis", "STU2024004", LocalDate.of(2008, 11, 30), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "mason.student@greenvalley.edu",
                "Mason", "Thompson", "STU2024016", LocalDate.of(2008, 5, 22), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "charlotte.student@greenvalley.edu",
                "Charlotte", "Garcia", "STU2024017", LocalDate.of(2008, 9, 14), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "william.student@greenvalley.edu",
                "William", "Martinez", "STU2024018", LocalDate.of(2008, 2, 7), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "amelia.student@greenvalley.edu",
                "Amelia", "Robinson", "STU2024019", LocalDate.of(2008, 12, 30), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "benjamin.student@greenvalley.edu",
                "Benjamin", "Lopez", "STU2024020", LocalDate.of(2008, 4, 16), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "harper.student@greenvalley.edu",
                "Harper", "Lee", "STU2024021", LocalDate.of(2008, 8, 3), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "lucas.student@greenvalley.edu",
                "Lucas", "Walker", "STU2024022", LocalDate.of(2008, 11, 27), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "evelyn.student@greenvalley.edu",
                "Evelyn", "Hall", "STU2024023", LocalDate.of(2008, 6, 9), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "henry.student@greenvalley.edu",
                "Henry", "Allen", "STU2024024", LocalDate.of(2008, 10, 21), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "ella.student@greenvalley.edu",
                "Ella", "Young", "STU2024025", LocalDate.of(2008, 3, 15), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "jack.student@greenvalley.edu",
                "Jack", "Parker", "STU2024043", LocalDate.of(2008, 1, 19), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "zoey.student@greenvalley.edu",
                "Zoey", "Cruz", "STU2024044", LocalDate.of(2008, 6, 25), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "luke.student@greenvalley.edu",
                "Luke", "Morris", "STU2024049", LocalDate.of(2008, 4, 5), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "hannah.student@greenvalley.edu",
                "Hannah", "Morales", "STU2024050", LocalDate.of(2008, 8, 18), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "caleb.student@greenvalley.edu",
                "Caleb", "Peterson", "STU2024055", LocalDate.of(2008, 7, 23), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "ellie.student@greenvalley.edu",
                "Ellie", "Cooper", "STU2024056", LocalDate.of(2008, 12, 6), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "julian.student@greenvalley.edu",
                "Julian", "Kelly", "STU2024061", LocalDate.of(2008, 10, 15), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "hazel.student@greenvalley.edu",
                "Hazel", "Howard", "STU2024062", LocalDate.of(2008, 3, 21), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "max.student@greenvalley.edu",
                "Max", "Rivera", "STU2024067", LocalDate.of(2008, 11, 9), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "sophie.student@greenvalley.edu",
                "Sophie", "Barnes", "STU2024068", LocalDate.of(2008, 2, 14), Gender.FEMALE));

        // Classroom 2 (Grade 11)
        students.add(createStudent(schools.get(0), classRooms.get(2), "emma.student@greenvalley.edu",
                "Emma", "Evans", "STU2024005", LocalDate.of(2007, 1, 18), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "alexander.student@greenvalley.edu",
                "Alexander", "King", "STU2024026", LocalDate.of(2007, 7, 11), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "scarlett.student@greenvalley.edu",
                "Scarlett", "Wright", "STU2024027", LocalDate.of(2007, 11, 23), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "jackson.student@greenvalley.edu",
                "Jackson", "Scott", "STU2024028", LocalDate.of(2007, 4, 29), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "grace.student@greenvalley.edu",
                "Grace", "Torres", "STU2024029", LocalDate.of(2007, 8, 6), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "sebastian.student@greenvalley.edu",
                "Sebastian", "Nguyen", "STU2024030", LocalDate.of(2007, 12, 18), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "chloe.student@greenvalley.edu",
                "Chloe", "Hill", "STU2024031", LocalDate.of(2007, 2, 24), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "aiden.student@greenvalley.edu",
                "Aiden", "Flores", "STU2024032", LocalDate.of(2007, 5, 31), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "victoria.student@greenvalley.edu",
                "Victoria", "Rivera", "STU2024033", LocalDate.of(2007, 9, 14), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "matthew.student@greenvalley.edu",
                "Matthew", "Campbell", "STU2024034", LocalDate.of(2007, 1, 7), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "madison.student@greenvalley.edu",
                "Madison", "Mitchell", "STU2024035", LocalDate.of(2007, 10, 19), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "daniel.student@greenvalley.edu",
                "Daniel", "Carter", "STU2024036", LocalDate.of(2007, 3, 26), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "luna.student@greenvalley.edu",
                "Luna", "Roberts", "STU2024037", LocalDate.of(2007, 7, 2), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "joseph.student@greenvalley.edu",
                "Joseph", "Gomez", "STU2024038", LocalDate.of(2007, 11, 15), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "penelope.student@greenvalley.edu",
                "Penelope", "Phillips", "STU2024039", LocalDate.of(2007, 4, 8), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "david.student@greenvalley.edu",
                "David", "Evans", "STU2024040", LocalDate.of(2007, 8, 22), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "owen.student@greenvalley.edu",
                "Owen", "Edwards", "STU2024045", LocalDate.of(2007, 12, 3), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "nora.student@greenvalley.edu",
                "Nora", "Collins", "STU2024046", LocalDate.of(2007, 3, 17), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "ryan.student@greenvalley.edu",
                "Ryan", "Murphy", "STU2024051", LocalDate.of(2007, 2, 13), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "zoe.student@greenvalley.edu",
                "Zoe", "Cook", "STU2024052", LocalDate.of(2007, 6, 27), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "isaac.student@greenvalley.edu",
                "Isaac", "Reed", "STU2024057", LocalDate.of(2007, 5, 12), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "violet.student@greenvalley.edu",
                "Violet", "Bailey", "STU2024058", LocalDate.of(2007, 9, 25), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "leo.student@greenvalley.edu",
                "Leo", "Ward", "STU2024063", LocalDate.of(2007, 7, 28), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "savannah.student@greenvalley.edu",
                "Savannah", "Cox", "STU2024064", LocalDate.of(2007, 11, 9), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "thomas.student@greenvalley.edu",
                "Thomas", "Sanders", "STU2024069", LocalDate.of(2007, 4, 19), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "aria.student@greenvalley.edu",
                "Aria", "Price", "STU2024070", LocalDate.of(2007, 10, 25), Gender.FEMALE));

        // School 2 Students - Sunshine Academy
        // Classroom 3 (Grade 7)
        students.add(createStudent(schools.get(1), classRooms.get(3), "frank.student@sunshine.edu",
                "Frank", "Foster", "STU2024001", LocalDate.of(2010, 4, 12), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "grace.student@sunshine.edu",
                "Grace", "Green", "STU2024002", LocalDate.of(2010, 8, 25), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "ivy.student@sunshine.edu",
                "Ivy", "Watson", "STU2024004", LocalDate.of(2010, 5, 20), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "luke.student@sunshine.edu",
                "Luke", "Brooks", "STU2024005", LocalDate.of(2010, 9, 7), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "maya.student@sunshine.edu",
                "Maya", "Bennett", "STU2024006", LocalDate.of(2010, 2, 13), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "owen.student@sunshine.edu",
                "Owen", "Gray", "STU2024007", LocalDate.of(2010, 6, 28), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "ruby.student@sunshine.edu",
                "Ruby", "James", "STU2024008", LocalDate.of(2010, 11, 4), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "elijah.student@sunshine.edu",
                "Elijah", "Ross", "STU2024009", LocalDate.of(2010, 3, 19), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "bella.student@sunshine.edu",
                "Bella", "Henderson", "STU2024010", LocalDate.of(2010, 7, 25), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "carter.student@sunshine.edu",
                "Carter", "Coleman", "STU2024011", LocalDate.of(2010, 12, 12), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "aria.student@sunshine.edu",
                "Aria", "Jenkins", "STU2024012", LocalDate.of(2010, 4, 30), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "jayden.student@sunshine.edu",
                "Jayden", "Perry", "STU2024013", LocalDate.of(2010, 8, 16), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "alice.student@sunshine.edu",
                "Alice", "Powell", "STU2024014", LocalDate.of(2010, 1, 22), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "grayson.student@sunshine.edu",
                "Grayson", "Long", "STU2024015", LocalDate.of(2010, 10, 9), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "eleanor.student@sunshine.edu",
                "Eleanor", "Patterson", "STU2024016", LocalDate.of(2010, 5, 5), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "lincoln.student@sunshine.edu",
                "Lincoln", "Hughes", "STU2024017", LocalDate.of(2010, 9, 18), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "claire.student@sunshine.edu",
                "Claire", "Flores", "STU2024018", LocalDate.of(2010, 2, 27), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "austin.student@sunshine.edu",
                "Austin", "Price", "STU2024039", LocalDate.of(2010, 1, 7), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "aubrey.student@sunshine.edu",
                "Aubrey", "Murray", "STU2024040", LocalDate.of(2010, 5, 18), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "adam.student@sunshine.edu",
                "Adam", "Jordan", "STU2024043", LocalDate.of(2010, 6, 13), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "sarah.student@sunshine.edu",
                "Sarah", "Reynolds", "STU2024044", LocalDate.of(2010, 10, 28), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "tyler.student@sunshine.edu",
                "Tyler", "Stevens", "STU2024047", LocalDate.of(2010, 3, 4), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "julia.student@sunshine.edu",
                "Julia", "Dixon", "STU2024048", LocalDate.of(2010, 7, 17), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "eli.student@sunshine.edu",
                "Eli", "Freeman", "STU2024049", LocalDate.of(2010, 11, 21), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "violet.student@sunshine.edu",
                "Violet", "Chapman", "STU2024050", LocalDate.of(2010, 4, 26), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "micah.student@sunshine.edu",
                "Micah", "Lawson", "STU2024051", LocalDate.of(2010, 8, 9), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "nova.student@sunshine.edu",
                "Nova", "Warren", "STU2024052", LocalDate.of(2010, 12, 14), Gender.FEMALE));

        // Classroom 4 (Grade 8)
        students.add(createStudent(schools.get(1), classRooms.get(4), "henry.student@sunshine.edu",
                "Henry", "Harris", "STU2024003", LocalDate.of(2009, 12, 3), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "landon.student@sunshine.edu",
                "Landon", "Washington", "STU2024019", LocalDate.of(2009, 6, 11), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "skylar.student@sunshine.edu",
                "Skylar", "Butler", "STU2024020", LocalDate.of(2009, 10, 24), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "levi.student@sunshine.edu",
                "Levi", "Simmons", "STU2024021", LocalDate.of(2009, 3, 8), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "addison.student@sunshine.edu",
                "Addison", "Foster", "STU2024022", LocalDate.of(2009, 7, 15), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "hudson.student@sunshine.edu",
                "Hudson", "Gonzales", "STU2024023", LocalDate.of(2009, 11, 30), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "brooklyn.student@sunshine.edu",
                "Brooklyn", "Bryant", "STU2024024", LocalDate.of(2009, 4, 17), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "elias.student@sunshine.edu",
                "Elias", "Alexander", "STU2024025", LocalDate.of(2009, 8, 22), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "lillian.student@sunshine.edu",
                "Lillian", "Russell", "STU2024026", LocalDate.of(2009, 12, 5), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "colton.student@sunshine.edu",
                "Colton", "Griffin", "STU2024027", LocalDate.of(2009, 1, 28), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "leah.student@sunshine.edu",
                "Leah", "Hayes", "STU2024028", LocalDate.of(2009, 5, 14), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "xavier.student@sunshine.edu",
                "Xavier", "Palmer", "STU2024029", LocalDate.of(2009, 9, 29), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "anna.student@sunshine.edu",
                "Anna", "Robertson", "STU2024030", LocalDate.of(2009, 2, 11), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "jaxon.student@sunshine.edu",
                "Jaxon", "Hunt", "STU2024031", LocalDate.of(2009, 6, 26), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "samantha.student@sunshine.edu",
                "Samantha", "Black", "STU2024032", LocalDate.of(2009, 10, 8), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "connor.student@sunshine.edu",
                "Connor", "Stone", "STU2024033", LocalDate.of(2009, 3, 23), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "paisley.student@sunshine.edu",
                "Paisley", "Meyer", "STU2024034", LocalDate.of(2009, 7, 31), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "asher.student@sunshine.edu",
                "Asher", "Ford", "STU2024035", LocalDate.of(2009, 12, 16), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "caroline.student@sunshine.edu",
                "Caroline", "Wells", "STU2024036", LocalDate.of(2009, 4, 3), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "cameron.student@sunshine.edu",
                "Cameron", "Barnes", "STU2024037", LocalDate.of(2009, 8, 19), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "piper.student@sunshine.edu",
                "Piper", "Sanders", "STU2024038", LocalDate.of(2009, 11, 25), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "jordan.student@sunshine.edu",
                "Jordan", "Cole", "STU2024041", LocalDate.of(2009, 9, 2), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "natalie.student@sunshine.edu",
                "Natalie", "West", "STU2024042", LocalDate.of(2009, 2, 25), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "chase.student@sunshine.edu",
                "Chase", "Fisher", "STU2024045", LocalDate.of(2009, 4, 9), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "kennedy.student@sunshine.edu",
                "Kennedy", "Ellis", "STU2024046", LocalDate.of(2009, 8, 21), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "evan.student@sunshine.edu",
                "Evan", "Marshall", "STU2024053", LocalDate.of(2009, 5, 7), Gender.MALE));

        return students;
    }

    private Student createStudent(School school, ClassRoom classRoom, String email, String firstName,
                                  String lastName, String regNumber, LocalDate birthDate, Gender gender) {
        User user = User.builder()
                .schoolId(school.getId())
                .email(email)
                .password(passwordEncoder.encode("Student@123"))
                .firstName(firstName)
                .lastName(lastName)
                .role(Role.STUDENT)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        Student student = Student.builder()
                .user(user)
                .school(school)
                .classRoom(classRoom)
                .registrationNumber(regNumber)
                .birthDate(birthDate)
                .gender(gender)
                .enrollmentDate(LocalDate.of(2024, 9, 1))
                .status(StudentStatus.ACTIVE)
                .build();
        return studentRepository.save(student);
    }

    private List<Parent> createParents(List<School> schools) {
        List<Parent> parents = new ArrayList<>();

        // School 1 Parents
        parents.add(createParent(schools.get(0), "parent1@example.com", "Thomas", "Anderson", "Engineer"));
        parents.add(createParent(schools.get(0), "parent2@example.com", "Linda", "Baker", "Doctor"));

        // School 2 Parents
        parents.add(createParent(schools.get(1), "parent3@example.com", "James", "Foster", "Lawyer"));

        return parents;
    }

    private Parent createParent(School school, String email, String firstName, String lastName, String occupation) {
        User user = User.builder()
                .schoolId(school.getId())
                .email(email)
                .password(passwordEncoder.encode("Parent@123"))
                .firstName(firstName)
                .lastName(lastName)
                .role(Role.PARENT)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        Parent parent = Parent.builder()
                .user(user)
                .school(school)
                .occupation(occupation)
                .build();
        return parentRepository.save(parent);
    }

    private List<ParentStudent> linkParentsToStudents(List<Parent> parents, List<Student> students) {
        List<ParentStudent> relationships = new ArrayList<>();

        // Thomas Anderson -> Alice (FATHER, primary), Bob (FATHER, non-primary)
        relationships.add(createParentStudent(parents.get(0), students.get(0), "FATHER", true));
        relationships.add(createParentStudent(parents.get(0), students.get(1), "FATHER", false));

        // Linda Baker -> Bob (MOTHER, primary)
        relationships.add(createParentStudent(parents.get(1), students.get(1), "MOTHER", true));

        // James Foster -> Frank (FATHER, primary), Grace (FATHER, non-primary)
        relationships.add(createParentStudent(parents.get(2), students.get(5), "FATHER", true));
        relationships.add(createParentStudent(parents.get(2), students.get(6), "FATHER", false));

        return relationships;
    }

    private ParentStudent createParentStudent(Parent parent, Student student, String relationship, boolean isPrimary) {
        ParentStudent ps = ParentStudent.builder()
                .parent(parent)
                .student(student)
                .relationshipType(relationship)
                .isPrimaryContact(isPrimary)
                .build();
        return parentStudentRepository.save(ps);
    }

    private List<Course> createCourses(List<School> schools, List<ClassRoom> classRooms,
                                       List<Teacher> teachers, List<Speciality> specialities) {
        List<Course> courses = new ArrayList<>();

        // Find specialities for school 1
        Speciality mathSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("MATH"))
                .findFirst().orElse(null);
        Speciality engSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("ENG"))
                .findFirst().orElse(null);
        Speciality physSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("PHYS"))
                .findFirst().orElse(null);

        // School 1 Courses
        courses.add(createCourse(schools.get(0), classRooms.get(0), teachers.get(0),
                "Algebra", "MATH101", "Mon/Wed 9:00-10:30", "FULL_YEAR", mathSpec));
        courses.add(createCourse(schools.get(0), classRooms.get(1), teachers.get(1),
                "English Literature", "ENG201", "Tue/Thu 10:00-11:30", "FULL_YEAR", engSpec));
        courses.add(createCourse(schools.get(0), classRooms.get(2), teachers.get(2),
                "Physics", "PHY301", "Mon/Wed/Fri 14:00-15:00", "FULL_YEAR", physSpec));

        // Find specialities for school 2
        Speciality sciSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(1).getId()) && s.getCode().equals("SCI"))
                .findFirst().orElse(null);

        // School 2 Courses
        courses.add(createCourse(schools.get(1), classRooms.get(3), teachers.get(3),
                "General Science", "SCI101", "Mon/Wed 9:00-10:30", "FULL_YEAR", sciSpec));
        courses.add(createCourse(schools.get(1), classRooms.get(4), teachers.get(4),
                "Chemistry", "CHEM201", "Tue/Thu 11:00-12:00", "FULL_YEAR", sciSpec));

        return courses;
    }


    private Course createCourse(School school, ClassRoom classRoom, Teacher teacher,
                                String subject, String code, String schedule, String semester, Speciality speciality) {
        Course course = Course.builder()
                .schoolId(school.getId())
                .classRoom(classRoom)
                .teacher(teacher)
                .speciality(speciality)
                .subject(subject)
                .subjectCode(code)
                .schedule(schedule)
                .semester(semester)
                .build();
        return courseRepository.save(course);
    }

    private List<Absence> createAbsences(List<School> schools, List<Student> students,
                                         List<Course> courses, List<Teacher> teachers) {
        List<Absence> absences = new ArrayList<>();

        // Alice absent from Algebra
        absences.add(createAbsence(schools.get(0), students.get(0), courses.get(0),
                teachers.get(0), LocalDate.of(2024, 11, 15), null, false, null));

        // Charlie absent from English
        absences.add(createAbsence(schools.get(0), students.get(2), courses.get(1),
                teachers.get(1), LocalDate.of(2024, 11, 18), "Medical emergency", true, "medical_doc_001.pdf"));

        // Frank absent from Science
        absences.add(createAbsence(schools.get(1), students.get(5), courses.get(3),
                teachers.get(3), LocalDate.of(2024, 11, 20), null, false, null));

        return absences;
    }

    private Absence createAbsence(School school, Student student, Course course, Teacher teacher,
                                  LocalDate date, String reason, boolean justified, String document) {
        Absence absence = Absence.builder()
                .schoolId(school.getId())
                .student(student)
                .course(course)
                .date(date)
                .reason(reason)
                .justified(justified)
                .justificationDocument(document)
                .reportedBy(teacher.getUser().getId())
                .build();
        return absenceRepository.save(absence);
    }

    private List<Payment> createPayments(List<School> schools, List<Student> students) {
        List<Payment> payments = new ArrayList<>();

        // Alice: PAID
        payments.add(createPayment(schools.get(0), students.get(0), new BigDecimal("500.00"),
                PaymentType.TUITION, PaymentStatus.PAID, LocalDate.of(2024, 9, 1),
                LocalDate.of(2024, 9, 1), "INV-2024-001"));

        // Bob: PENDING
        payments.add(createPayment(schools.get(0), students.get(1), new BigDecimal("500.00"),
                PaymentType.TUITION, PaymentStatus.PENDING, LocalDate.of(2024, 11, 1),
                null, "INV-2024-002"));

        // Charlie: OVERDUE
        payments.add(createPayment(schools.get(0), students.get(2), new BigDecimal("500.00"),
                PaymentType.TUITION, PaymentStatus.OVERDUE, LocalDate.of(2024, 10, 1),
                null, "INV-2024-003"));

        // Frank: PAID
        payments.add(createPayment(schools.get(1), students.get(5), new BigDecimal("300.00"),
                PaymentType.TUITION, PaymentStatus.PAID, LocalDate.of(2024, 9, 1),
                LocalDate.of(2024, 9, 5), "INV-2024-004"));

        // Grace: PENDING
        payments.add(createPayment(schools.get(1), students.get(6), new BigDecimal("300.00"),
                PaymentType.REGISTRATION, PaymentStatus.PENDING, LocalDate.of(2024, 12, 1),
                null, "INV-2024-005"));

        return payments;
    }

    private Payment createPayment(School school, Student student, BigDecimal amount, PaymentType type,
                                  PaymentStatus status, LocalDate dueDate, LocalDate paidDate, String invoice) {
        Payment payment = Payment.builder()
                .schoolId(school.getId())
                .student(student)
                .amount(amount)
                .paymentType(type)
                .status(status)
                .dueDate(dueDate)
                .paidDate(paidDate)
                .invoiceNumber(invoice)
                .build();
        return paymentRepository.save(payment);
    }

    private List<Event> createEvents(List<School> schools, List<User> schoolAdmins) {
        List<Event> events = new ArrayList<>();

        // School 1 Events
        events.add(createEvent(schools.get(0), schoolAdmins.get(0), "Parent-Teacher Meeting",
                "Discuss student progress with parents", EventType.MEETING,
                LocalDateTime.of(2024, 12, 15, 14, 0), "School Auditorium", "PARENT"));

        events.add(createEvent(schools.get(0), schoolAdmins.get(0), "Final Exams",
                "End of semester examinations", EventType.EXAM,
                LocalDateTime.of(2025, 1, 10, 9, 0), "Exam Hall", "ALL"));

        // School 2 Events
        events.add(createEvent(schools.get(1), schoolAdmins.get(1), "Sports Day",
                "Annual sports competition", EventType.SPORTS_DAY,
                LocalDateTime.of(2024, 12, 20, 9, 0), "Sports Ground", "ALL"));

        return events;
    }

    private Event createEvent(School school, User creator, String title, String description,
                             EventType eventType, LocalDateTime eventDate, String location, String targetRole) {
        Event event = Event.builder()
                .schoolId(school.getId())
                .title(title)
                .description(description)
                .eventType(eventType)
                .eventDate(eventDate)
                .location(location)
                .targetRole(targetRole)
                .createdBy(creator.getId())
                .build();
        return eventRepository.save(event);
    }

    private List<Notification> createNotifications(List<School> schools, List<Parent> parents,
                                                   List<Student> students, List<Teacher> teachers) {
        List<Notification> notifications = new ArrayList<>();

        // To parent1: Payment Reminder (unread)
        notifications.add(createNotification(schools.get(0), parents.get(0).getUser(),
                "Payment Reminder", "Your child's tuition payment is due soon",
                NotificationType.WARNING, false, LocalDateTime.now().minusDays(2)));

        // To alice: Exam Schedule (unread)
        notifications.add(createNotification(schools.get(0), students.get(0).getUser(),
                "Exam Schedule", "Final exams start from January 10",
                NotificationType.INFO, false, LocalDateTime.now().minusDays(1)));

        // To math.teacher: New Event (read)
        notifications.add(createNotification(schools.get(0), teachers.get(0).getUser(),
                "New Event", "Sports day scheduled",
                NotificationType.INFO, true, LocalDateTime.now().minusDays(3)));

        return notifications;
    }

    private Notification createNotification(School school, User user, String title, String message,
                                           NotificationType type, boolean read, LocalDateTime sentAt) {
        Notification notification = Notification.builder()
                .schoolId(school.getId())
                .user(user)
                .title(title)
                .message(message)
                .notificationType(type)
                .readStatus(read)
                .sentAt(sentAt)
                .readAt(read ? sentAt.plusHours(1) : null)
                .build();
        return notificationRepository.save(notification);
    }

    private List<Issue> createIssues(List<School> schools, List<User> schoolAdmins, User superAdmin) {
        List<Issue> issues = new ArrayList<>();

        // School 1: Payment gateway issue
        issues.add(createIssue(schools.get(0), schoolAdmins.get(0), null,
                "Payment gateway not working",
                "The payment gateway integration is failing for online payments",
                IssueType.TECHNICAL_SUPPORT, IssuePriority.HIGH, IssueStatus.OPEN));

        // School 2: Storage request
        issues.add(createIssue(schools.get(1), schoolAdmins.get(1), superAdmin,
                "Need more storage",
                "Current storage limit is insufficient for our document needs",
                IssueType.FEATURE_REQUEST, IssuePriority.MEDIUM, IssueStatus.IN_PROGRESS));

        return issues;
    }

    private Issue createIssue(School school, User reporter, User assignedTo, String title,
                             String description, IssueType issueType, IssuePriority priority, IssueStatus status) {
        Issue issue = Issue.builder()
                .schoolId(school.getId())
                .reportedBy(reporter.getId())
                .assignedTo(assignedTo != null ? assignedTo.getId() : null)
                .title(title)
                .description(description)
                .issueType(issueType)
                .priority(priority)
                .status(status)
                .build();
        return issueRepository.save(issue);
    }

    private List<ChatMessage> createChatMessages(List<School> schools, List<Course> courses,
                                                 List<Student> students, List<Teacher> teachers) {
        List<ChatMessage> messages = new ArrayList<>();

        // Algebra course messages
        messages.add(createChatMessage(schools.get(0), courses.get(0), teachers.get(0).getUser(),
                "Welcome to Algebra class!", "TEXT", LocalDateTime.of(2024, 9, 2, 9, 0)));

        messages.add(createChatMessage(schools.get(0), courses.get(0), students.get(0).getUser(),
                "Thank you, teacher!", "TEXT", LocalDateTime.of(2024, 9, 2, 9, 5)));

        // Science course message
        messages.add(createChatMessage(schools.get(1), courses.get(3), teachers.get(3).getUser(),
                "Please submit your homework by Friday", "TEXT", LocalDateTime.of(2024, 11, 18, 10, 30)));

        return messages;
    }

    private ChatMessage createChatMessage(School school, Course course, User sender,
                                         String message, String messageType, LocalDateTime timestamp) {
        ChatMessage chatMessage = ChatMessage.builder()
                .schoolId(school.getId())
                .course(course)
                .sender(sender)
                .message(message)
                .messageType(messageType)
                .timestamp(timestamp)
                .build();
        return chatMessageRepository.save(chatMessage);
    }

    // Add this method after createChatMessages() method
    private List<Timetable> createTimetables(List<School> schools, List<ClassRoom> classRooms,
                                             List<Teacher> teachers, List<Course> courses, List<Speciality> specialities) {
        List<Timetable> timetables = new ArrayList<>();

        // Find specialities for school 1
        Speciality mathSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("MATH"))
                .findFirst().orElse(null);
        Speciality engSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("ENG"))
                .findFirst().orElse(null);
        Speciality physSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("PHYS"))
                .findFirst().orElse(null);
        Speciality chemSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("CHEM"))
                .findFirst().orElse(null);

        // School 1 - Green Valley High School Timetables
        // Monday
        timetables.add(createTimetable(schools.get(0), classRooms.get(0), teachers.get(0), courses.get(0),
                mathSpec, "MONDAY", "08:00", "09:30", "A101", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(0), classRooms.get(1), teachers.get(1), courses.get(1),
                engSpec, "MONDAY", "10:00", "11:30", "B201", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(0), classRooms.get(2), teachers.get(2), courses.get(2),
                physSpec, "MONDAY", "14:00", "15:30", "Lab 1", "Fall 2024", "2024-2025"));

        // Tuesday
        timetables.add(createTimetable(schools.get(0), classRooms.get(0), teachers.get(1), courses.get(1),
                engSpec, "TUESDAY", "09:00", "10:30", "A102", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(0), classRooms.get(1), teachers.get(2), courses.get(2),
                physSpec, "TUESDAY", "11:00", "12:30", "Lab 2", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(0), classRooms.get(2), teachers.get(0), courses.get(0),
                mathSpec, "TUESDAY", "13:00", "14:30", "A201", "Fall 2024", "2024-2025"));

        // Wednesday
        timetables.add(createTimetable(schools.get(0), classRooms.get(0), teachers.get(0), courses.get(0),
                mathSpec, "WEDNESDAY", "08:00", "09:30", "A101", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(0), classRooms.get(1), teachers.get(1), courses.get(1),
                engSpec, "WEDNESDAY", "10:00", "11:30", "B201", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(0), classRooms.get(2), teachers.get(2), courses.get(2),
                physSpec, "WEDNESDAY", "14:00", "15:30", "Lab 1", "Fall 2024", "2024-2025"));

        // Thursday
        timetables.add(createTimetable(schools.get(0), classRooms.get(0), teachers.get(2), courses.get(2),
                physSpec, "THURSDAY", "08:30", "10:00", "Lab 3", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(0), classRooms.get(1), teachers.get(0), courses.get(0),
                mathSpec, "THURSDAY", "10:30", "12:00", "A103", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(0), classRooms.get(2), teachers.get(1), courses.get(1),
                engSpec, "THURSDAY", "13:30", "15:00", "B202", "Fall 2024", "2024-2025"));

        // Friday
        timetables.add(createTimetable(schools.get(0), classRooms.get(0), teachers.get(1), courses.get(1),
                engSpec, "FRIDAY", "09:00", "10:30", "A102", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(0), classRooms.get(1), teachers.get(2), courses.get(2),
                physSpec, "FRIDAY", "11:00", "12:30", "Lab 1", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(0), classRooms.get(2), teachers.get(0), courses.get(0),
                mathSpec, "FRIDAY", "14:00", "15:30", "A201", "Fall 2024", "2024-2025"));

        // Find specialities for school 2
        Speciality sciSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(1).getId()) && s.getCode().equals("SCI"))
                .findFirst().orElse(null);

        // School 2 - Sunshine Academy Timetables
        // Monday
        timetables.add(createTimetable(schools.get(1), classRooms.get(3), teachers.get(3), courses.get(3),
                sciSpec, "MONDAY", "08:00", "09:30", "S101", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(1), classRooms.get(4), teachers.get(4), courses.get(4),
                sciSpec, "MONDAY", "10:00", "11:30", "Chem Lab", "Fall 2024", "2024-2025"));

        // Tuesday
        timetables.add(createTimetable(schools.get(1), classRooms.get(3), teachers.get(4), courses.get(4),
                sciSpec, "TUESDAY", "09:00", "10:30", "S102", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(1), classRooms.get(4), teachers.get(3), courses.get(3),
                sciSpec, "TUESDAY", "11:00", "12:30", "S201", "Fall 2024", "2024-2025"));

        // Wednesday
        timetables.add(createTimetable(schools.get(1), classRooms.get(3), teachers.get(3), courses.get(3),
                sciSpec, "WEDNESDAY", "08:00", "09:30", "S101", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(1), classRooms.get(4), teachers.get(4), courses.get(4),
                sciSpec, "WEDNESDAY", "10:00", "11:30", "Chem Lab", "Fall 2024", "2024-2025"));

        // Thursday
        timetables.add(createTimetable(schools.get(1), classRooms.get(3), teachers.get(4), courses.get(4),
                sciSpec, "THURSDAY", "08:30", "10:00", "S103", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(1), classRooms.get(4), teachers.get(3), courses.get(3),
                sciSpec, "THURSDAY", "10:30", "12:00", "S202", "Fall 2024", "2024-2025"));

        // Friday
        timetables.add(createTimetable(schools.get(1), classRooms.get(3), teachers.get(3), courses.get(3),
                sciSpec, "FRIDAY", "09:00", "10:30", "S101", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(1), classRooms.get(4), teachers.get(4), courses.get(4),
                sciSpec, "FRIDAY", "11:00", "12:30", "Chem Lab", "Fall 2024", "2024-2025"));

        // Additional mixed entries for variety
        timetables.add(createTimetable(schools.get(0), classRooms.get(0), teachers.get(2), courses.get(2),
                physSpec, "SATURDAY", "09:00", "10:30", "Lab 4", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(0), classRooms.get(1), teachers.get(0), courses.get(0),
                mathSpec, "SATURDAY", "11:00", "12:30", "A104", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(1), classRooms.get(3), teachers.get(4), courses.get(4),
                sciSpec, "SATURDAY", "08:00", "09:30", "S104", "Fall 2024", "2024-2025"));
        timetables.add(createTimetable(schools.get(1), classRooms.get(4), teachers.get(3), courses.get(3),
                sciSpec, "SATURDAY", "10:00", "11:30", "S203", "Fall 2024", "2024-2025"));

        return timetables;
    }

    private Timetable createTimetable(School school, ClassRoom classRoom, Teacher teacher, Course course,
                                      Speciality speciality, String dayOfWeek, String startTime, String endTime,
                                      String roomNumber, String semester, String academicYear) {
        Timetable timetable = Timetable.builder()
                .schoolId(school.getId())
                .classRoom(classRoom)
                .teacher(teacher)
                .course(course)
                .speciality(speciality)
                .dayOfWeek(DayOfWeek.valueOf(dayOfWeek))
                .startTime(LocalTime.parse(startTime))
                .endTime(LocalTime.parse(endTime))
                .roomNumber(roomNumber)
                .semester(semester)
                .academicYear(academicYear)
                .active(true)
                .build();
        return timetableRepository.save(timetable);
    }

    private List<Exam> createExams(List<School> schools, List<ClassRoom> classRooms,
                                   List<Teacher> teachers, List<Course> courses, List<Speciality> specialities) {
        List<Exam> exams = new ArrayList<>();

        // Find specialities for school 1
        Speciality mathSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("MATH"))
                .findFirst().orElse(null);
        Speciality engSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("ENG"))
                .findFirst().orElse(null);
        Speciality physSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("PHYS"))
                .findFirst().orElse(null);
        Speciality chemSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("CHEM"))
                .findFirst().orElse(null);
        Speciality bioSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(0).getId()) && s.getCode().equals("BIO"))
                .findFirst().orElse(null);

        // School 1 - Green Valley High School Exams
        // Grade 9 (Classroom 0) - Math Exams
        exams.add(createExam(schools.get(0), classRooms.get(0), teachers.get(0), courses.get(0),
                mathSpec, "Algebra Midterm Exam", "First semester midterm examination covering chapters 1-5",
                ExamType.MIDTERM, LocalDate.of(2024, 11, 15), LocalTime.of(9, 0), LocalTime.of(11, 0),
                120, "Hall A", 100, 40, "Fall 2024", "2024-2025", ExamStatus.COMPLETED,
                "Calculators allowed. Show all work.", true, false));

        exams.add(createExam(schools.get(0), classRooms.get(0), teachers.get(0), courses.get(0),
                mathSpec, "Algebra Final Exam", "Comprehensive final exam covering all topics",
                ExamType.FINAL, LocalDate.of(2025, 1, 20), LocalTime.of(9, 0), LocalTime.of(12, 0),
                180, "Hall A", 150, 60, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "Scientific calculators allowed. No graphing calculators.", true, false));

        exams.add(createExam(schools.get(0), classRooms.get(0), teachers.get(0), courses.get(0),
                mathSpec, "Geometry Quiz 1", "Quick assessment on basic geometric shapes",
                ExamType.QUIZ, LocalDate.of(2024, 10, 5), LocalTime.of(10, 0), LocalTime.of(10, 30),
                30, "Room A101", 20, 10, "Fall 2024", "2024-2025", ExamStatus.COMPLETED,
                "No calculators. Basic formulas provided.", false, false));

        exams.add(createExam(schools.get(0), classRooms.get(0), teachers.get(0), courses.get(0),
                mathSpec, "Monthly Test - October", "Monthly assessment covering October topics",
                ExamType.MONTHLY_TEST, LocalDate.of(2024, 10, 28), LocalTime.of(14, 0), LocalTime.of(15, 30),
                90, "Room A101", 50, 25, "Fall 2024", "2024-2025", ExamStatus.COMPLETED,
                "Standard calculators allowed.", true, false));

        // Grade 10 (Classroom 1) - English Exams
        exams.add(createExam(schools.get(0), classRooms.get(1), teachers.get(1), courses.get(1),
                engSpec, "Literature Midterm", "Analysis of classic literature works",
                ExamType.MIDTERM, LocalDate.of(2024, 11, 18), LocalTime.of(9, 0), LocalTime.of(11, 30),
                150, "Hall B", 100, 40, "Fall 2024", "2024-2025", ExamStatus.COMPLETED,
                "Open book exam. Bring your annotated texts.", false, true));

        exams.add(createExam(schools.get(0), classRooms.get(1), teachers.get(1), courses.get(1),
                engSpec, "Poetry Analysis Quiz", "Understanding poetic devices and themes",
                ExamType.QUIZ, LocalDate.of(2024, 10, 12), LocalTime.of(11, 0), LocalTime.of(11, 45),
                45, "Room B201", 25, 13, "Fall 2024", "2024-2025", ExamStatus.COMPLETED,
                "Closed book exam.", false, false));

        exams.add(createExam(schools.get(0), classRooms.get(1), teachers.get(1), courses.get(1),
                engSpec, "Essay Writing Assignment", "Analytical essay on Shakespeare",
                ExamType.ASSIGNMENT, LocalDate.of(2024, 11, 30), LocalTime.of(9, 0), LocalTime.of(11, 0),
                120, "Room B201", 50, 25, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "Bring your rough drafts. In-class writing.", false, false));

        exams.add(createExam(schools.get(0), classRooms.get(1), teachers.get(1), courses.get(1),
                engSpec, "Oral Presentation", "Book review oral presentation",
                ExamType.ORAL, LocalDate.of(2024, 12, 5), LocalTime.of(13, 0), LocalTime.of(16, 0),
                180, "Room B201", 30, 18, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "5-7 minutes per student. Visual aids allowed.", false, false));

        // Grade 11 (Classroom 2) - Physics Exams
        exams.add(createExam(schools.get(0), classRooms.get(2), teachers.get(2), courses.get(2),
                physSpec, "Mechanics Midterm", "Newton's laws and motion dynamics",
                ExamType.MIDTERM, LocalDate.of(2024, 11, 20), LocalTime.of(14, 0), LocalTime.of(16, 30),
                150, "Lab 1", 100, 40, "Fall 2024", "2024-2025", ExamStatus.COMPLETED,
                "Formula sheet provided. Calculators required.", true, false));

        exams.add(createExam(schools.get(0), classRooms.get(2), teachers.get(2), courses.get(2),
                physSpec, "Electricity Practical", "Hands-on circuit building and analysis",
                ExamType.PRACTICAL, LocalDate.of(2024, 12, 10), LocalTime.of(14, 0), LocalTime.of(17, 0),
                180, "Lab 1", 50, 25, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "Lab safety rules must be followed.", false, false));

        exams.add(createExam(schools.get(0), classRooms.get(2), teachers.get(2), courses.get(2),
                physSpec, "Thermodynamics Unit Test", "Heat, temperature, and energy transfer",
                ExamType.UNIT_TEST, LocalDate.of(2024, 11, 5), LocalTime.of(10, 0), LocalTime.of(11, 30),
                90, "Room Lab 2", 60, 30, "Fall 2024", "2024-2025", ExamStatus.COMPLETED,
                "Scientific calculators allowed.", true, false));

        exams.add(createExam(schools.get(0), classRooms.get(2), teachers.get(2), courses.get(2),
                physSpec, "Physics Research Project", "Independent research on modern physics topics",
                ExamType.PROJECT, LocalDate.of(2024, 12, 20), LocalTime.of(9, 0), LocalTime.of(12, 0),
                180, "Lab 1", 100, 50, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "Presentation and written report required.", false, false));

        // Find specialities for school 2
        Speciality sciSpec = specialities.stream()
                .filter(s -> s.getSchoolId().equals(schools.get(1).getId()) && s.getCode().equals("SCI"))
                .findFirst().orElse(null);

        // School 2 - Sunshine Academy Exams
        // Grade 8 (Classroom 3) - Science Exams
        exams.add(createExam(schools.get(1), classRooms.get(3), teachers.get(3), courses.get(3),
                sciSpec, "General Science Midterm", "Biology, Chemistry, and Physics basics",
                ExamType.MIDTERM, LocalDate.of(2024, 11, 22), LocalTime.of(9, 0), LocalTime.of(11, 0),
                120, "Room S101", 100, 40, "Fall 2024", "2024-2025", ExamStatus.COMPLETED,
                "Multiple choice and short answer questions.", false, false));

        exams.add(createExam(schools.get(1), classRooms.get(3), teachers.get(3), courses.get(3),
                sciSpec, "Science Fair Project", "Individual or group science project presentation",
                ExamType.PROJECT, LocalDate.of(2024, 12, 15), LocalTime.of(10, 0), LocalTime.of(15, 0),
                300, "Gymnasium", 75, 40, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "Project display and oral presentation required.", false, false));

        exams.add(createExam(schools.get(1), classRooms.get(3), teachers.get(3), courses.get(3),
                sciSpec, "Biology Quiz", "Cell structure and functions",
                ExamType.QUIZ, LocalDate.of(2024, 10, 18), LocalTime.of(10, 30), LocalTime.of(11, 0),
                30, "Room S101", 20, 12, "Fall 2024", "2024-2025", ExamStatus.COMPLETED,
                "Diagram labeling included.", false, false));

        exams.add(createExam(schools.get(1), classRooms.get(3), teachers.get(3), courses.get(3),
                sciSpec, "Chemistry Lab Practical", "Basic chemical reactions and safety",
                ExamType.PRACTICAL, LocalDate.of(2024, 11, 8), LocalTime.of(14, 0), LocalTime.of(16, 0),
                120, "Chem Lab", 40, 20, "Fall 2024", "2024-2025", ExamStatus.COMPLETED,
                "Safety goggles and lab coats required.", false, false));

        // Grade 9 (Classroom 4) - Chemistry Exams
        exams.add(createExam(schools.get(1), classRooms.get(4), teachers.get(4), courses.get(4),
                sciSpec, "Chemistry Semester Exam", "Comprehensive chemistry examination",
                ExamType.SEMESTER_EXAM, LocalDate.of(2024, 12, 18), LocalTime.of(9, 0), LocalTime.of(12, 0),
                180, "Hall C", 120, 50, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "Periodic table provided. Calculators allowed.", true, false));

        exams.add(createExam(schools.get(1), classRooms.get(4), teachers.get(4), courses.get(4),
                sciSpec, "Organic Chemistry Quiz", "Naming and structures of organic compounds",
                ExamType.QUIZ, LocalDate.of(2024, 10, 25), LocalTime.of(11, 0), LocalTime.of(11, 40),
                40, "Room Chem Lab", 25, 15, "Fall 2024", "2024-2025", ExamStatus.COMPLETED,
                "No reference materials allowed.", false, false));

        exams.add(createExam(schools.get(1), classRooms.get(4), teachers.get(4), courses.get(4),
                sciSpec, "Stoichiometry Assignment", "Problem-solving in chemical equations",
                ExamType.ASSIGNMENT, LocalDate.of(2024, 11, 12), LocalTime.of(14, 0), LocalTime.of(15, 30),
                90, "Room S201", 35, 18, "Fall 2024", "2024-2025", ExamStatus.COMPLETED,
                "Show all calculation steps.", true, false));

        exams.add(createExam(schools.get(1), classRooms.get(4), teachers.get(4), courses.get(4),
                sciSpec, "Monthly Test - November", "November topics assessment",
                ExamType.MONTHLY_TEST, LocalDate.of(2024, 11, 29), LocalTime.of(10, 0), LocalTime.of(11, 30),
                90, "Room S201", 50, 25, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "Standard exam format.", true, false));

        // Additional variety exams
        exams.add(createExam(schools.get(0), classRooms.get(0), teachers.get(0), courses.get(0),
                mathSpec, "Trigonometry Quiz", "Basic trigonometric functions",
                ExamType.QUIZ, LocalDate.of(2024, 12, 3), LocalTime.of(9, 0), LocalTime.of(9, 45),
                45, "Room A101", 30, 15, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "Unit circle will be provided.", false, false));

        exams.add(createExam(schools.get(0), classRooms.get(1), teachers.get(1), courses.get(1),
                engSpec, "Grammar Unit Test", "Parts of speech and sentence structure",
                ExamType.UNIT_TEST, LocalDate.of(2024, 12, 8), LocalTime.of(10, 0), LocalTime.of(11, 0),
                60, "Room B201", 40, 24, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "No reference materials.", false, false));

        exams.add(createExam(schools.get(0), classRooms.get(2), teachers.get(2), courses.get(2),
                physSpec, "Optics Quiz", "Light, reflection, and refraction",
                ExamType.QUIZ, LocalDate.of(2024, 12, 12), LocalTime.of(14, 30), LocalTime.of(15, 15),
                45, "Lab 1", 25, 13, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "Bring your own calculator.", true, false));

        exams.add(createExam(schools.get(1), classRooms.get(3), teachers.get(3), courses.get(3),
                sciSpec, "Earth Science Unit Test", "Geology and weather patterns",
                ExamType.UNIT_TEST, LocalDate.of(2024, 12, 6), LocalTime.of(9, 30), LocalTime.of(10, 45),
                75, "Room S101", 45, 23, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "Maps and charts provided.", false, false));

        exams.add(createExam(schools.get(1), classRooms.get(4), teachers.get(4), courses.get(4),
                sciSpec, "Lab Safety Quiz", "Chemical safety and procedures",
                ExamType.QUIZ, LocalDate.of(2024, 9, 15), LocalTime.of(11, 0), LocalTime.of(11, 20),
                20, "Chem Lab", 15, 12, "Fall 2024", "2024-2025", ExamStatus.COMPLETED,
                "Mandatory for all students.", false, false));

        exams.add(createExam(schools.get(0), classRooms.get(0), teachers.get(0), courses.get(0),
                mathSpec, "Probability Assignment", "Calculating probabilities and statistics",
                ExamType.ASSIGNMENT, LocalDate.of(2024, 12, 16), LocalTime.of(13, 0), LocalTime.of(14, 30),
                90, "Room A101", 40, 20, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "Data sets will be provided.", true, false));

        exams.add(createExam(schools.get(0), classRooms.get(1), teachers.get(1), courses.get(1),
                engSpec, "Creative Writing Project", "Original short story or essay",
                ExamType.PROJECT, LocalDate.of(2024, 12, 19), LocalTime.of(9, 0), LocalTime.of(12, 0),
                180, "Room B201", 60, 30, "Fall 2024", "2024-2025", ExamStatus.SCHEDULED,
                "Minimum 1500 words. Typed submissions only.", false, false));

        exams.add(createExam(schools.get(1), classRooms.get(3), teachers.get(3), courses.get(3),
                sciSpec, "Physics Practical - Postponed", "Mechanics lab work",
                ExamType.PRACTICAL, LocalDate.of(2024, 12, 14), LocalTime.of(14, 0), LocalTime.of(16, 0),
                120, "Lab 2", 50, 25, "Fall 2024", "2024-2025", ExamStatus.POSTPONED,
                "Rescheduled due to equipment maintenance.", false, false));

        exams.add(createExam(schools.get(0), classRooms.get(2), teachers.get(2), courses.get(2),
                physSpec, "Wave Motion Cancelled", "Study of wave properties",
                ExamType.QUIZ, LocalDate.of(2024, 11, 25), LocalTime.of(10, 0), LocalTime.of(10, 45),
                45, "Lab 1", 20, 10, "Fall 2024", "2024-2025", ExamStatus.CANCELLED,
                "Cancelled due to teacher absence.", false, false));

        return exams;
    }

    private Exam createExam(School school, ClassRoom classRoom, Teacher teacher, Course course,
                            Speciality speciality, String title, String description, ExamType examType,
                            LocalDate examDate, LocalTime startTime, LocalTime endTime, Integer durationMinutes,
                            String roomNumber, Integer maxMarks, Integer passingMarks, String semester,
                            String academicYear, ExamStatus status, String instructions,
                            Boolean allowCalculators, Boolean allowBooks) {
        Exam exam = Exam.builder()
                .schoolId(UUID.fromString(String.valueOf(school.getId())))
                .classRoom(classRoom)
                .course(course)
                .teacher(teacher)
                .speciality(speciality)
                .title(title)
                .description(description)
                .examType(examType)
                .examDate(examDate)
                .startTime(startTime)
                .endTime(endTime)
                .durationMinutes(durationMinutes)
                .roomNumber(roomNumber)
                .maxMarks(maxMarks)
                .passingMarks(passingMarks)
                .semester(semester)
                .academicYear(academicYear)
                .status(status)
                .instructions(instructions)
                .allowCalculators(allowCalculators)
                .allowBooks(allowBooks)
                .resultsPublished(status == ExamStatus.COMPLETED)
                .resultsPublishedAt(status == ExamStatus.COMPLETED ? LocalDateTime.now().minusDays(5) : null)
                .build();
        return examRepository.save(exam);
    }

    private List<ExamResult> createExamResults(List<School> schools, List<Exam> exams,
                                               List<Student> students, List<Teacher> teachers) {
        List<ExamResult> results = new ArrayList<>();

        // Get completed exams only
        List<Exam> completedExams = exams.stream()
                .filter(e -> e.getStatus() == ExamStatus.COMPLETED)
                .collect(Collectors.toList());

        // School 1 - Exam Results
        // Algebra Midterm (Exam 0) - Grade 9 students
        if (!completedExams.isEmpty() && students.size() >= 22) {
            Exam algebraMidterm = completedExams.get(0);

            // Create results for Grade 9 students (first 22 students)
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(0), teachers.get(0),
                    85.0, 100, "A", ResultStatus.PASS, "Excellent work!", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(1), teachers.get(0),
                    72.0, 100, "B", ResultStatus.PASS, "Good understanding", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(2), teachers.get(0),
                    null, 100, null, ResultStatus.ABSENT, null, true));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(3), teachers.get(0),
                    91.0, 100, "A+", ResultStatus.PASS, "Outstanding performance", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(4), teachers.get(0),
                    68.0, 100, "C+", ResultStatus.PASS, "Needs improvement in algebra", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(5), teachers.get(0),
                    78.0, 100, "B+", ResultStatus.PASS, "Very good", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(6), teachers.get(0),
                    55.0, 100, "D", ResultStatus.PASS, "Work on basics", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(7), teachers.get(0),
                    88.0, 100, "A", ResultStatus.PASS, "Excellent", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(8), teachers.get(0),
                    76.0, 100, "B", ResultStatus.PASS, "Good job", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(9), teachers.get(0),
                    82.0, 100, "A-", ResultStatus.PASS, "Very good work", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(10), teachers.get(0),
                    64.0, 100, "C", ResultStatus.PASS, "Average", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(11), teachers.get(0),
                    93.0, 100, "A+", ResultStatus.PASS, "Top scorer!", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(12), teachers.get(0),
                    70.0, 100, "B-", ResultStatus.PASS, "Good effort", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(13), teachers.get(0),
                    45.0, 100, "D", ResultStatus.PASS, "Need more practice", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(14), teachers.get(0),
                    81.0, 100, "A-", ResultStatus.PASS, "Well done", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(15), teachers.get(0),
                    89.0, 100, "A", ResultStatus.PASS, "Excellent understanding", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(16), teachers.get(0),
                    75.0, 100, "B", ResultStatus.PASS, "Good work", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(17), teachers.get(0),
                    67.0, 100, "C+", ResultStatus.PASS, "Satisfactory", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(18), teachers.get(0),
                    84.0, 100, "A-", ResultStatus.PASS, "Very good", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(19), teachers.get(0),
                    77.0, 100, "B+", ResultStatus.PASS, "Good performance", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(20), teachers.get(0),
                    36.0, 100, "F", ResultStatus.FAIL, "Below passing marks", false));
            results.add(createExamResult(schools.get(0), algebraMidterm, students.get(21), teachers.get(0),
                    92.0, 100, "A+", ResultStatus.PASS, "Exceptional!", false));
        }

        // Geometry Quiz (Exam 2) - Grade 9 students (subset)
        if (completedExams.size() > 2 && students.size() >= 15) {
            Exam geometryQuiz = completedExams.get(2);

            results.add(createExamResult(schools.get(0), geometryQuiz, students.get(0), teachers.get(0),
                    18.0, 20, "A", ResultStatus.PASS, "Perfect shapes!", false));
            results.add(createExamResult(schools.get(0), geometryQuiz, students.get(1), teachers.get(0),
                    15.0, 20, "B+", ResultStatus.PASS, "Good", false));
            results.add(createExamResult(schools.get(0), geometryQuiz, students.get(3), teachers.get(0),
                    19.0, 20, "A+", ResultStatus.PASS, "Excellent!", false));
            results.add(createExamResult(schools.get(0), geometryQuiz, students.get(4), teachers.get(0),
                    12.0, 20, "C", ResultStatus.PASS, "OK", false));
            results.add(createExamResult(schools.get(0), geometryQuiz, students.get(5), teachers.get(0),
                    16.0, 20, "A-", ResultStatus.PASS, "Very good", false));
            results.add(createExamResult(schools.get(0), geometryQuiz, students.get(7), teachers.get(0),
                    17.0, 20, "A", ResultStatus.PASS, "Great job", false));
            results.add(createExamResult(schools.get(0), geometryQuiz, students.get(8), teachers.get(0),
                    14.0, 20, "B", ResultStatus.PASS, "Good work", false));
            results.add(createExamResult(schools.get(0), geometryQuiz, students.get(11), teachers.get(0),
                    20.0, 20, "A+", ResultStatus.PASS, "Perfect score!", false));
            results.add(createExamResult(schools.get(0), geometryQuiz, students.get(12), teachers.get(0),
                    13.0, 20, "B-", ResultStatus.PASS, "Good effort", false));
            results.add(createExamResult(schools.get(0), geometryQuiz, students.get(14), teachers.get(0),
                    16.0, 20, "A-", ResultStatus.PASS, "Well done", false));
        }

        // Monthly Test October (Exam 3) - Grade 9 students
        if (completedExams.size() > 3 && students.size() >= 20) {
            Exam monthlyTest = completedExams.get(3);

            results.add(createExamResult(schools.get(0), monthlyTest, students.get(0), teachers.get(0),
                    42.0, 50, "A", ResultStatus.PASS, "Strong performance", false));
            results.add(createExamResult(schools.get(0), monthlyTest, students.get(1), teachers.get(0),
                    36.0, 50, "B", ResultStatus.PASS, "Good", false));
            results.add(createExamResult(schools.get(0), monthlyTest, students.get(3), teachers.get(0),
                    45.0, 50, "A+", ResultStatus.PASS, "Excellent!", false));
            results.add(createExamResult(schools.get(0), monthlyTest, students.get(5), teachers.get(0),
                    38.0, 50, "B+", ResultStatus.PASS, "Very good", false));
            results.add(createExamResult(schools.get(0), monthlyTest, students.get(7), teachers.get(0),
                    41.0, 50, "A-", ResultStatus.PASS, "Great work", false));
            results.add(createExamResult(schools.get(0), monthlyTest, students.get(9), teachers.get(0),
                    40.0, 50, "A-", ResultStatus.PASS, "Well done", false));
            results.add(createExamResult(schools.get(0), monthlyTest, students.get(11), teachers.get(0),
                    47.0, 50, "A+", ResultStatus.PASS, "Outstanding", false));
            results.add(createExamResult(schools.get(0), monthlyTest, students.get(13), teachers.get(0),
                    28.0, 50, "C+", ResultStatus.PASS, "Needs work", false));
            results.add(createExamResult(schools.get(0), monthlyTest, students.get(15), teachers.get(0),
                    39.0, 50, "B+", ResultStatus.PASS, "Good job", false));
            results.add(createExamResult(schools.get(0), monthlyTest, students.get(17), teachers.get(0),
                    33.0, 50, "B-", ResultStatus.PASS, "Satisfactory", false));
        }

        // Literature Midterm (Exam 4) - Grade 10 students
        if (completedExams.size() > 4 && students.size() >= 44) {
            Exam literatureMidterm = completedExams.get(4);

            results.add(createExamResult(schools.get(0), literatureMidterm, students.get(22), teachers.get(1),
                    88.0, 100, "A", ResultStatus.PASS, "Insightful analysis", false));
            results.add(createExamResult(schools.get(0), literatureMidterm, students.get(23), teachers.get(1),
                    75.0, 100, "B", ResultStatus.PASS, "Good interpretation", false));
            results.add(createExamResult(schools.get(0), literatureMidterm, students.get(24), teachers.get(1),
                    92.0, 100, "A+", ResultStatus.PASS, "Brilliant essay!", false));
            results.add(createExamResult(schools.get(0), literatureMidterm, students.get(25), teachers.get(1),
                    68.0, 100, "C+", ResultStatus.PASS, "Needs more depth", false));
            results.add(createExamResult(schools.get(0), literatureMidterm, students.get(26), teachers.get(1),
                    81.0, 100, "A-", ResultStatus.PASS, "Well written", false));
            results.add(createExamResult(schools.get(0), literatureMidterm, students.get(27), teachers.get(1),
                    null, 100, null, ResultStatus.ABSENT, null, true));
            results.add(createExamResult(schools.get(0), literatureMidterm, students.get(28), teachers.get(1),
                    79.0, 100, "B+", ResultStatus.PASS, "Good work", false));
            results.add(createExamResult(schools.get(0), literatureMidterm, students.get(29), teachers.get(1),
                    85.0, 100, "A", ResultStatus.PASS, "Excellent analysis", false));
            results.add(createExamResult(schools.get(0), literatureMidterm, students.get(30), teachers.get(1),
                    72.0, 100, "B-", ResultStatus.PASS, "Good effort", false));
            results.add(createExamResult(schools.get(0), literatureMidterm, students.get(31), teachers.get(1),
                    90.0, 100, "A+", ResultStatus.PASS, "Outstanding!", false));
        }

        // Poetry Quiz (Exam 5) - Grade 10 students (subset)
        if (completedExams.size() > 5 && students.size() >= 38) {
            Exam poetryQuiz = completedExams.get(5);

            results.add(createExamResult(schools.get(0), poetryQuiz, students.get(22), teachers.get(1),
                    22.0, 25, "A", ResultStatus.PASS, "Great understanding", false));
            results.add(createExamResult(schools.get(0), poetryQuiz, students.get(24), teachers.get(1),
                    24.0, 25, "A+", ResultStatus.PASS, "Perfect!", false));
            results.add(createExamResult(schools.get(0), poetryQuiz, students.get(26), teachers.get(1),
                    19.0, 25, "B+", ResultStatus.PASS, "Good", false));
            results.add(createExamResult(schools.get(0), poetryQuiz, students.get(29), teachers.get(1),
                    21.0, 25, "A-", ResultStatus.PASS, "Very good", false));
            results.add(createExamResult(schools.get(0), poetryQuiz, students.get(31), teachers.get(1),
                    23.0, 25, "A+", ResultStatus.PASS, "Excellent", false));
        }

        // Mechanics Midterm (Exam 8) - Grade 11 students
        if (completedExams.size() > 7 && students.size() >= 66) {
            Exam mechanicsMidterm = completedExams.get(7);

            results.add(createExamResult(schools.get(0), mechanicsMidterm, students.get(44), teachers.get(2),
                    86.0, 100, "A", ResultStatus.PASS, "Excellent problem solving", false));
            results.add(createExamResult(schools.get(0), mechanicsMidterm, students.get(45), teachers.get(2),
                    74.0, 100, "B", ResultStatus.PASS, "Good understanding", false));
            results.add(createExamResult(schools.get(0), mechanicsMidterm, students.get(46), teachers.get(2),
                    91.0, 100, "A+", ResultStatus.PASS, "Outstanding work!", false));
            results.add(createExamResult(schools.get(0), mechanicsMidterm, students.get(47), teachers.get(2),
                    67.0, 100, "C+", ResultStatus.PASS, "Need more practice", false));
            results.add(createExamResult(schools.get(0), mechanicsMidterm, students.get(48), teachers.get(2),
                    83.0, 100, "A-", ResultStatus.PASS, "Very good", false));
            results.add(createExamResult(schools.get(0), mechanicsMidterm, students.get(49), teachers.get(2),
                    null, 100, null, ResultStatus.ABSENT, null, true));
            results.add(createExamResult(schools.get(0), mechanicsMidterm, students.get(50), teachers.get(2),
                    79.0, 100, "B+", ResultStatus.PASS, "Good work", false));
            results.add(createExamResult(schools.get(0), mechanicsMidterm, students.get(51), teachers.get(2),
                    88.0, 100, "A", ResultStatus.PASS, "Excellent", false));
            results.add(createExamResult(schools.get(0), mechanicsMidterm, students.get(52), teachers.get(2),
                    35.0, 100, "F", ResultStatus.FAIL, "Below passing", false));
            results.add(createExamResult(schools.get(0), mechanicsMidterm, students.get(53), teachers.get(2),
                    94.0, 100, "A+", ResultStatus.PASS, "Top performance!", false));
        }

        // Thermodynamics Unit Test (Exam 10) - Grade 11 students (subset)
        if (completedExams.size() > 9 && students.size() >= 60) {
            Exam thermoTest = completedExams.get(9);

            results.add(createExamResult(schools.get(0), thermoTest, students.get(44), teachers.get(2),
                    52.0, 60, "A", ResultStatus.PASS, "Excellent", false));
            results.add(createExamResult(schools.get(0), thermoTest, students.get(46), teachers.get(2),
                    56.0, 60, "A+", ResultStatus.PASS, "Outstanding!", false));
            results.add(createExamResult(schools.get(0), thermoTest, students.get(48), teachers.get(2),
                    48.0, 60, "B+", ResultStatus.PASS, "Very good", false));
            results.add(createExamResult(schools.get(0), thermoTest, students.get(51), teachers.get(2),
                    51.0, 60, "A-", ResultStatus.PASS, "Great work", false));
            results.add(createExamResult(schools.get(0), thermoTest, students.get(53), teachers.get(2),
                    57.0, 60, "A+", ResultStatus.PASS, "Perfect understanding", false));
        }

        // School 2 Results
        // General Science Midterm (Exam 11) - Grade 8 students
        if (completedExams.size() > 10 && students.size() >= 93) {
            Exam scienceMidterm = completedExams.get(10);

            results.add(createExamResult(schools.get(1), scienceMidterm, students.get(70), teachers.get(3),
                    84.0, 100, "A", ResultStatus.PASS, "Excellent work", false));
            results.add(createExamResult(schools.get(1), scienceMidterm, students.get(71), teachers.get(3),
                    76.0, 100, "B+", ResultStatus.PASS, "Good job", false));
            results.add(createExamResult(schools.get(1), scienceMidterm, students.get(72), teachers.get(3),
                    null, 100, null, ResultStatus.ABSENT, null, true));
            results.add(createExamResult(schools.get(1), scienceMidterm, students.get(73), teachers.get(3),
                    89.0, 100, "A", ResultStatus.PASS, "Very good", false));
            results.add(createExamResult(schools.get(1), scienceMidterm, students.get(74), teachers.get(3),
                    71.0, 100, "B", ResultStatus.PASS, "Good", false));
            results.add(createExamResult(schools.get(1), scienceMidterm, students.get(75), teachers.get(3),
                    92.0, 100, "A+", ResultStatus.PASS, "Outstanding!", false));
            results.add(createExamResult(schools.get(1), scienceMidterm, students.get(76), teachers.get(3),
                    65.0, 100, "C+", ResultStatus.PASS, "Satisfactory", false));
            results.add(createExamResult(schools.get(1), scienceMidterm, students.get(77), teachers.get(3),
                    80.0, 100, "A-", ResultStatus.PASS, "Well done", false));
            results.add(createExamResult(schools.get(1), scienceMidterm, students.get(78), teachers.get(3),
                    73.0, 100, "B", ResultStatus.PASS, "Good work", false));
            results.add(createExamResult(schools.get(1), scienceMidterm, students.get(79), teachers.get(3),
                    87.0, 100, "A", ResultStatus.PASS, "Excellent", false));
        }

        return results;
    }

    private ExamResult createExamResult(School school, Exam exam, Student student, Teacher teacher,
                                        Double marksObtained, Integer maxMarks, String grade,
                                        ResultStatus status, String remarks, Boolean absent) {
        ExamResult result = ExamResult.builder()
                .schoolId(UUID.fromString(String.valueOf(school.getId())))
                .exam(exam)
                .student(student)
                .marksObtained(marksObtained)
                .maxMarks(maxMarks)
                .percentage(marksObtained != null ? (marksObtained / maxMarks) * 100 : null)
                .grade(grade)
                .status(status)
                .remarks(remarks)
                .absent(absent)
                .gradedBy(String.valueOf(teacher.getUser().getId()))
                .gradedAt(absent ? null : LocalDateTime.now().minusDays(3))
                .build();
        return examResultRepository.save(result);
    }



    private void logSummary() {
        log.info("=== Test Data Summary ===");
        log.info("Super Admins: 1");
        log.info("Subscription Plans: {}", subscriptionPlanRepository.count());
        log.info("Schools: {}", schoolRepository.count());
        log.info("Subscriptions: {}", subscriptionRepository.count());
        log.info("School Admins: 2");
        log.info("Teachers: {}", teacherRepository.count());
        log.info("Students: {}", studentRepository.count());
        log.info("Parents: {}", parentRepository.count());
        log.info("Parent-Student Relationships: {}", parentStudentRepository.count());
        log.info("Classrooms: {}", classRoomRepository.count());
        log.info("Courses: {}", courseRepository.count());
        log.info("Absences: {}", absenceRepository.count());
        log.info("Payments: {}", paymentRepository.count());
        log.info("Events: {}", eventRepository.count());
        log.info("Notifications: {}", notificationRepository.count());
        log.info("Issues: {}", issueRepository.count());
        log.info("Chat Messages: {}", chatMessageRepository.count());
        log.info("Timetables: {}", timetableRepository.count());
        log.info("Exams: {}", examRepository.count());
        log.info("Exam Results: {}", examResultRepository.count());
        log.info("========================");
    }
}
