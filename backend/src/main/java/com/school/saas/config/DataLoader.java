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
import com.school.saas.module.user.User;
import com.school.saas.module.user.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

            // 6. Create Teachers
            List<Teacher> teachers = createTeachers(schools);
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
            List<Course> courses = createCourses(schools, classRooms, teachers);
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

    private List<Teacher> createTeachers(List<School> schools) {
        List<Teacher> teachers = new ArrayList<>();

        // School 1 Teachers
        teachers.add(createTeacher(schools.get(0), "math.teacher@greenvalley.edu", "Robert", "Johnson",
                "Mathematics", "EMP001"));
        teachers.add(createTeacher(schools.get(0), "english.teacher@greenvalley.edu", "Emily", "Williams",
                "English Literature", "EMP002"));
        teachers.add(createTeacher(schools.get(0), "science.teacher@greenvalley.edu", "David", "Brown",
                "Physics", "EMP003"));

        // School 2 Teachers
        teachers.add(createTeacher(schools.get(1), "physics.teacher@sunshine.edu", "Michael", "Davis",
                "Physics", "EMP001"));
        teachers.add(createTeacher(schools.get(1), "chemistry.teacher@sunshine.edu", "Sarah", "Wilson",
                "Chemistry", "EMP002"));

        return teachers;
    }

    private Teacher createTeacher(School school, String email, String firstName, String lastName,
                                  String speciality, String employeeNumber) {
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
                .schoolId(school.getId())
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

        // School 1 Students
        students.add(createStudent(schools.get(0), classRooms.get(0), "alice.student@greenvalley.edu",
                "Alice", "Anderson", "STU2024001", LocalDate.of(2009, 5, 15), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(0), "bob.student@greenvalley.edu",
                "Bob", "Baker", "STU2024002", LocalDate.of(2009, 7, 22), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "charlie.student@greenvalley.edu",
                "Charlie", "Clark", "STU2024003", LocalDate.of(2008, 3, 10), Gender.MALE));
        students.add(createStudent(schools.get(0), classRooms.get(1), "diana.student@greenvalley.edu",
                "Diana", "Davis", "STU2024004", LocalDate.of(2008, 11, 30), Gender.FEMALE));
        students.add(createStudent(schools.get(0), classRooms.get(2), "emma.student@greenvalley.edu",
                "Emma", "Evans", "STU2024005", LocalDate.of(2007, 1, 18), Gender.FEMALE));

        // School 2 Students
        students.add(createStudent(schools.get(1), classRooms.get(3), "frank.student@sunshine.edu",
                "Frank", "Foster", "STU2024001", LocalDate.of(2010, 4, 12), Gender.MALE));
        students.add(createStudent(schools.get(1), classRooms.get(3), "grace.student@sunshine.edu",
                "Grace", "Green", "STU2024002", LocalDate.of(2010, 8, 25), Gender.FEMALE));
        students.add(createStudent(schools.get(1), classRooms.get(4), "henry.student@sunshine.edu",
                "Henry", "Harris", "STU2024003", LocalDate.of(2009, 12, 3), Gender.MALE));

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
                .schoolId(school.getId())
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
                .schoolId(school.getId())
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

    private List<Course> createCourses(List<School> schools, List<ClassRoom> classRooms, List<Teacher> teachers) {
        List<Course> courses = new ArrayList<>();

        // School 1 Courses
        courses.add(createCourse(schools.get(0), classRooms.get(0), teachers.get(0),
                "Algebra", "MATH101", "Mon/Wed 9:00-10:30", "FULL_YEAR"));
        courses.add(createCourse(schools.get(0), classRooms.get(1), teachers.get(1),
                "English Literature", "ENG201", "Tue/Thu 10:00-11:30", "FULL_YEAR"));
        courses.add(createCourse(schools.get(0), classRooms.get(2), teachers.get(2),
                "Physics", "PHY301", "Mon/Wed/Fri 14:00-15:00", "FULL_YEAR"));

        // School 2 Courses
        courses.add(createCourse(schools.get(1), classRooms.get(3), teachers.get(3),
                "General Science", "SCI101", "Mon/Wed 9:00-10:30", "FULL_YEAR"));
        courses.add(createCourse(schools.get(1), classRooms.get(4), teachers.get(4),
                "Chemistry", "CHEM201", "Tue/Thu 11:00-12:00", "FULL_YEAR"));

        return courses;
    }

    private Course createCourse(School school, ClassRoom classRoom, Teacher teacher,
                                String subject, String code, String schedule, String semester) {
        Course course = Course.builder()
                .schoolId(school.getId())
                .classRoom(classRoom)
                .teacher(teacher)
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
        log.info("========================");
    }
}
