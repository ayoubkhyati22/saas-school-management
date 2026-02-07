export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
  TRANSFERRED = 'TRANSFERRED',
  SUSPENDED = 'SUSPENDED',
}

export enum TeacherStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  TRIAL = 'TRIAL',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum PlanFeatureType {
  CHAT = 'CHAT',
  ANALYTICS_DASHBOARD = 'ANALYTICS_DASHBOARD',
  MOBILE_APP_ACCESS = 'MOBILE_APP_ACCESS',
  CUSTOM_REPORTS = 'CUSTOM_REPORTS',
  VIDEO_CALL = 'VIDEO_CALL',
  API_ACCESS = 'API_ACCESS',
  PRIORITY_SUPPORT = 'PRIORITY_SUPPORT',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum PaymentType {
  TUITION = 'TUITION',
  REGISTRATION = 'REGISTRATION',
  EXAM_FEE = 'EXAM_FEE',
  LIBRARY_FEE = 'LIBRARY_FEE',
  TRANSPORT_FEE = 'TRANSPORT_FEE',
  OTHER = 'OTHER',
}

export enum EventType {
  MEETING = 'MEETING',
  EXAM = 'EXAM',
  HOLIDAY = 'HOLIDAY',
  SPORTS_DAY = 'SPORTS_DAY',
  CULTURAL_EVENT = 'CULTURAL_EVENT',
  PARENT_TEACHER_MEETING = 'PARENT_TEACHER_MEETING',
  OTHER = 'OTHER',
}

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export enum IssueType {
  BUG = 'BUG',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  TECHNICAL_SUPPORT = 'TECHNICAL_SUPPORT',
  BILLING_ISSUE = 'BILLING_ISSUE',
  OTHER = 'OTHER',
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export interface User {
  id: string
  schoolId?: string
  email: string
  firstName: string
  lastName: string
  role: Role
  phoneNumber?: string
  avatarUrl?: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface School {
  id: string
  name: string
  address: string
  email: string
  phone: string
  logoUrl?: string
  active: boolean
  registrationDate: string
  createdAt: string
  updatedAt: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  maxStudents: number
  maxTeachers: number
  maxStorageGb: number
  maxClasses: number
  active: boolean
  features: PlanFeature[]
  createdAt: string
  updatedAt: string
}

export interface PlanFeature {
  id: string
  featureType: PlanFeatureType
  enabled: boolean
}

export interface Subscription {
  id: string
  school: School
  subscriptionPlan: SubscriptionPlan
  billingCycle: BillingCycle
  startDate: string
  endDate: string
  status: SubscriptionStatus
  autoRenew: boolean
  createdAt: string
  updatedAt: string
}

export interface Teacher {
  id: string
  user: User
  school: School
  speciality: string
  hireDate: string
  employeeNumber: string
  status: TeacherStatus
  salary: number
  address?: string
  emergencyContact?: string
  administrativeDocuments?: string
  createdAt: string
  updatedAt: string
}

export interface Student {
  id: string
  user: User
  school: School
  classRoom: ClassRoom
  registrationNumber: string
  birthDate: string
  gender: Gender
  enrollmentDate: string
  status: StudentStatus
  address?: string
  emergencyContact?: string
  medicalInfo?: string
  documents?: string
  createdAt: string
  updatedAt: string
}

export interface Parent {
  id: string
  user: User
  school: School
  occupation?: string
  address?: string
  emergencyContact?: string
  createdAt: string
  updatedAt: string
}

export interface ParentStudent {
  id: string
  parent: Parent
  student: Student
  relationshipType: string
  isPrimaryContact: boolean
}

export interface ClassRoom {
  id: string
  schoolId: string
  name: string
  level: string
  section: string
  academicYear: string
  capacity: number
  classTeacher: Teacher
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: string
  schoolId: string
  classRoom: ClassRoom
  teacher: Teacher
  subject: string
  subjectCode: string
  description?: string
  schedule?: string
  semester?: string
  documents?: string
  createdAt: string
  updatedAt: string
}

export interface CourseMaterial {
  id: string
  course: Course
  title: string
  description?: string
  fileUrl: string
  fileType: string
  uploadedBy: string
  createdAt: string
}

export interface Absence {
  id: string
  schoolId: string
  student: Student
  course: Course
  date: string
  reason?: string
  justified: boolean
  justificationDocument?: string
  reportedBy: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  schoolId: string
  student: Student
  amount: number
  paymentType: PaymentType
  status: PaymentStatus
  dueDate: string
  paidDate?: string
  invoiceNumber: string
  paymentMethod?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  schoolId: string
  title: string
  description: string
  eventType: EventType
  eventDate: string
  location?: string
  targetRole?: string
  imageUrl?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  schoolId: string
  user: User
  title: string
  message: string
  notificationType: NotificationType
  readStatus: boolean
  sentAt: string
  readAt?: string
}

export interface Issue {
  id: string
  schoolId: string
  reportedBy: string
  assignedTo?: string
  title: string
  description: string
  issueType: IssueType
  priority: IssuePriority
  status: IssueStatus
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

export interface IssueComment {
  id: string
  issue: Issue
  author: User
  comment: string
  createdAt: string
}

export interface Document {
  id: string
  schoolId: string
  uploadedBy: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  entityType: string
  entityId: string
  description?: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  schoolId: string
  course: Course
  sender: User
  message: string
  messageType: string
  timestamp: string
}

export interface AuditLog {
  id: string
  schoolId?: string
  userId: string
  action: string
  entityType: string
  entityId?: string
  changes?: string
  ipAddress?: string
  userAgent?: string
  timestamp: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PageResponse<T> {
  success: boolean
  message: string
  data: {
    content: T[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role: Role
  schoolId?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface DashboardStats {
  totalSchools?: number
  activeSubscriptions?: number
  totalRevenue?: number
  totalUsers?: number
  totalStudents?: number
  totalTeachers?: number
  attendanceRate?: number
  pendingPayments?: number
}
