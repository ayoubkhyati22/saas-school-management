class LoginResponse {
  final String accessToken;
  final String refreshToken;
  final String tokenType;
  final String userId;
  final String email;
  final String firstName;
  final String lastName;
  final String role;
  final String schoolId;

  LoginResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.tokenType,
    required this.userId,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.role,
    required this.schoolId,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      accessToken: json['accessToken'],
      refreshToken: json['refreshToken'],
      tokenType: json['tokenType'],
      userId: json['userId'],
      email: json['email'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      role: json['role'],
      schoolId: json['schoolId'],
    );
  }
}
