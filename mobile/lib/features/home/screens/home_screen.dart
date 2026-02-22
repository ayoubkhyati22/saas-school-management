import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../data/models/login_response.dart';
import '../../../data/services/api_service.dart';

class HomeScreen extends StatefulWidget {
  final LoginResponse loginResponse;

  const HomeScreen({super.key, required this.loginResponse});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _apiService = ApiService();
  int _courseCount = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    try {
      final student = await _apiService.getStudent(
        widget.loginResponse.accessToken,
        widget.loginResponse.userId,
      );
      final courses = await _apiService.getCoursesByClassroom(
        widget.loginResponse.accessToken,
        student.classRoomId,
      );

      if (mounted) {
        setState(() {
          _courseCount = courses.length;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.background,
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeroHeader(),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionTitle('Overview'),
                  const SizedBox(height: 16),
                  _buildStatGrid(),
                  const SizedBox(height: 32),
                  _buildSectionTitle('Learning Journey'),
                  const SizedBox(height: 16),
                  _buildQuickActions(),
                  const SizedBox(height: 32),
                  _buildInspirationalQuote(),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroHeader() {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(40),
          bottomRight: Radius.circular(40),
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            right: -50,
            top: -50,
            child: CircleAvatar(
              radius: 100,
              backgroundColor: Colors.white.withOpacity(0.05),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(24, 20, 24, 40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Good Morning,',
                            style: TextStyle(color: Colors.white70, fontSize: 16),
                          ),
                          Text(
                            widget.loginResponse.firstName,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ],
                      ),
                      const CircleAvatar(
                        radius: 28,
                        backgroundColor: Colors.white24,
                        child: Icon(Icons.person_rounded, color: Colors.white, size: 30),
                      )
                    ],
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.stars, color: Colors.amber, size: 20),
                        const SizedBox(width: 8),
                        Text(
                          '4 pending assignments',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.9),
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.bold,
        color: AppColors.textSecondary,
      ),
    );
  }

  Widget _buildStatGrid() {
    return Row(
      children: [
        Expanded(
          child: _StatCard(
            title: 'My Courses',
            value: _isLoading ? '...' : '$_courseCount',
            icon: Icons.menu_book_rounded,
            color: AppColors.indigo,
          ),
        ),
        const SizedBox(width: 16),
        const Expanded(
          child: _StatCard(
            title: 'Avg. Grade',
            value: 'A-',
            icon: Icons.auto_graph_rounded,
            color: AppColors.emerald,
          ),
        ),
      ],
    );
  }

  Widget _buildQuickActions() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 20, offset: const Offset(0, 10)),
        ],
      ),
      child: const Column(
        children: [
          _ActionButton(
            icon: Icons.calendar_today,
            title: 'Class Schedule',
            color: Colors.blue,
            subtitle: "View today's routine",
          ),
          Divider(height: 32, color: AppColors.dividerLight),
          _ActionButton(
            icon: Icons.assignment_turned_in,
            title: 'My Results',
            color: Colors.orange,
            subtitle: 'Semester final report',
          ),
        ],
      ),
    );
  }

  Widget _buildInspirationalQuote() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
        ),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.format_quote_rounded, color: Colors.blue.shade300, size: 40),
          const Text(
            "Intelligence plus character—that is the goal of true education.",
            style: TextStyle(color: Colors.white, fontSize: 16, height: 1.5, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 12),
          Text(
            "- Martin Luther King Jr.",
            style: TextStyle(color: Colors.blue.shade200, fontSize: 13, fontWeight: FontWeight.bold),
          )
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({required this.title, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: color.withOpacity(0.1), blurRadius: 20, offset: const Offset(0, 10)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(color: AppColors.textMuted, fontSize: 14, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;

  const _ActionButton({required this.icon, required this.title, required this.color, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          height: 50,
          width: 50,
          decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(15)),
          child: Icon(icon, color: color),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textSecondary)),
              Text(subtitle, style: const TextStyle(fontSize: 13, color: AppColors.textMuted)),
            ],
          ),
        ),
        const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.textLight),
      ],
    );
  }
}
