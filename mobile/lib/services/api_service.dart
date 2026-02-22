import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/login_response.dart';
import '../models/user_dto.dart';
import '../models/student_detail_dto.dart';
import '../models/course_dto.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:8080';

  Future<LoginResponse> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/login'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return LoginResponse.fromJson(data);
      } else {
        final errorData = jsonDecode(response.body);
        throw Exception(errorData['message'] ?? 'Invalid email or password');
      }
    } catch (e) {
      throw Exception('Failed to login: $e');
    }
  }

  Future<UserDTO> getMe(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/auth/me'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return UserDTO.fromJson(data);
      } else {
        throw Exception('Failed to get user info');
      }
    } catch (e) {
      throw Exception('Failed to get user info: $e');
    }
  }

  Future<StudentDetailDTO> getStudent(String token, String studentId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/students/$studentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return StudentDetailDTO.fromJson(data);
      } else {
        throw Exception('Failed to get student details');
      }
    } catch (e) {
      throw Exception('Failed to get student details: $e');
    }
  }

  Future<List<CourseDTO>> getCoursesByClassroom(
      String token, String classRoomId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/courses/classroom/$classRoomId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => CourseDTO.fromJson(json)).toList();
      } else {
        throw Exception('Failed to get courses');
      }
    } catch (e) {
      throw Exception('Failed to get courses: $e');
    }
  }
}
