import 'package:flutter/material.dart';
import '../models/login_response.dart';
import '../widgets/home_tab.dart';
import '../widgets/courses_tab.dart';
import '../widgets/profile_tab.dart';

class DashboardScreen extends StatefulWidget {
  final LoginResponse loginResponse;

  const DashboardScreen({
    super.key,
    required this.loginResponse,
  });

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 1;

  @override
  Widget build(BuildContext context) {
    final List<Widget> tabs = [
      HomeTab(loginResponse: widget.loginResponse),
      CoursesTab(loginResponse: widget.loginResponse),
      ProfileTab(loginResponse: widget.loginResponse),
    ];

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          'Hello, ${widget.loginResponse.firstName} 👋',
          style: const TextStyle(
            color: Colors.black87,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: CircleAvatar(
              backgroundColor: const Color(0xFF1565C0),
              child: Text(
                '${widget.loginResponse.firstName[0]}${widget.loginResponse.lastName[0]}',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
      ),
      body: tabs[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        selectedItemColor: const Color(0xFF1565C0),
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_rounded),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.menu_book_rounded),
            label: 'Courses',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_rounded),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
