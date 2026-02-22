class StudentDetailDTO {
  final String id;
  final String userId;
  final String firstName;
  final String lastName;
  final String email;
  final String schoolId;
  final String classRoomId;
  final String classRoomName;
  final String classRoomLevel;
  final String classRoomSection;
  final String registrationNumber;
  final String birthDate;
  final String gender;
  final String enrollmentDate;
  final String status;

  StudentDetailDTO({
    required this.id,
    required this.userId,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.schoolId,
    required this.classRoomId,
    required this.classRoomName,
    required this.classRoomLevel,
    required this.classRoomSection,
    required this.registrationNumber,
    required this.birthDate,
    required this.gender,
    required this.enrollmentDate,
    required this.status,
  });

  factory StudentDetailDTO.fromJson(Map<String, dynamic> json) {
    return StudentDetailDTO(
      id: json['id'],
      userId: json['userId'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      email: json['email'],
      schoolId: json['schoolId'],
      classRoomId: json['classRoomId'],
      classRoomName: json['classRoomName'],
      classRoomLevel: json['classRoomLevel'],
      classRoomSection: json['classRoomSection'],
      registrationNumber: json['registrationNumber'],
      birthDate: json['birthDate'],
      gender: json['gender'],
      enrollmentDate: json['enrollmentDate'],
      status: json['status'],
    );
  }
}
