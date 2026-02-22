class UserDTO {
  final String id;
  final String schoolId;
  final String email;
  final String firstName;
  final String lastName;
  final String role;

  UserDTO({
    required this.id,
    required this.schoolId,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.role,
  });

  factory UserDTO.fromJson(Map<String, dynamic> json) {
    return UserDTO(
      id: json['id'],
      schoolId: json['schoolId'],
      email: json['email'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      role: json['role'],
    );
  }
}
