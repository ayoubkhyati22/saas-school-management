class CourseDTO {
  final String id;
  final String schoolId;
  final String classRoomId;
  final String classRoomName;
  final String teacherId;
  final String teacherName;
  final String specialityId;
  final String specialityName;
  final String specialityCode;
  final String subject;
  final String subjectCode;
  final String? description;
  final String schedule;
  final String semester;
  final String createdAt;
  final String updatedAt;

  CourseDTO({
    required this.id,
    required this.schoolId,
    required this.classRoomId,
    required this.classRoomName,
    required this.teacherId,
    required this.teacherName,
    required this.specialityId,
    required this.specialityName,
    required this.specialityCode,
    required this.subject,
    required this.subjectCode,
    this.description,
    required this.schedule,
    required this.semester,
    required this.createdAt,
    required this.updatedAt,
  });

  factory CourseDTO.fromJson(Map<String, dynamic> json) {
    return CourseDTO(
      id: json['id'],
      schoolId: json['schoolId'],
      classRoomId: json['classRoomId'],
      classRoomName: json['classRoomName'],
      teacherId: json['teacherId'],
      teacherName: json['teacherName'],
      specialityId: json['specialityId'],
      specialityName: json['specialityName'],
      specialityCode: json['specialityCode'],
      subject: json['subject'],
      subjectCode: json['subjectCode'],
      description: json['description'],
      schedule: json['schedule'],
      semester: json['semester'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
    );
  }
}
