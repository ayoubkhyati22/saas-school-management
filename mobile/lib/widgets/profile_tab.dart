import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart'; // Although not used for shimmer, keeping imports
import '../models/login_response.dart';
import '../screens/login_screen.dart';

class ProfileTab extends StatelessWidget {
  final LoginResponse loginResponse;

  const ProfileTab({super.key, required this.loginResponse});

  void _handleLogout(BuildContext context) {
    // Clear tokens, session data, etc. before navigating to LoginScreen.
    // This is a simplified navigation; in a real app, consider a more robust auth state management.
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => const LoginScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFF8FAFC), // Consistent modern background
      child: Column(
        children: [
          _buildHeaderArea(),
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  _buildUserInfoCard(),
                  const SizedBox(height: 24),
                  _buildDetailsSection(),
                  const SizedBox(height: 32),
                  _buildLogoutButton(context),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderArea() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(bottom: 60), // Gives space for the user card to overlap
      decoration: const BoxDecoration(
        color: Color(0xFF1565C0), // Primary dark blue
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(40),
          bottomRight: Radius.circular(40),
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
          child: Column(
            children: [
              const Text(
                'Your Profile',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 32),
              Stack(
                clipBehavior: Clip.none, // Allow avatar to go outside
                alignment: Alignment.bottomCenter,
                children: [
                  // Avatar itself
                  Container(
                    width: 110,
                    height: 110,
                    padding: const EdgeInsets.all(5),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        color: const Color(0xFF6366F1), // Soft Indigo
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          '${loginResponse.firstName[0]}${loginResponse.lastName[0]}'.toUpperCase(),
                          style: const TextStyle(
                            fontSize: 42,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: -1,
                          ),
                        ),
                      ),
                    ),
                  ),
                  // Status Badge (Optional, but nice for modern profile)
                  Positioned(
                    bottom: 8,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981), // Emerald Green for 'Active'
                        borderRadius: BorderRadius.circular(10),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.green.withOpacity(0.2),
                            blurRadius: 5,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.check_circle, size: 14, color: Colors.white),
                          SizedBox(width: 4),
                          Text('Active', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildUserInfoCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.shade200,
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            '${loginResponse.firstName} ${loginResponse.lastName}',
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1E293B),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            loginResponse.email,
            style: const TextStyle(
              fontSize: 14,
              color: Color(0xFF64748B), // Soft Slate Grey
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailsSection() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.shade200,
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          _buildDetailRow(
            icon: Icons.school_outlined,
            label: 'School ID',
            value: loginResponse.schoolId.substring(0, 8) + '...', // Truncated for space
            iconColor: const Color(0xFF6366F1), // Indigo
          ),
          const _CustomDivider(),
          _buildDetailRow(
            icon: Icons.business_rounded,
            label: 'Role',
            value: loginResponse.role,
            iconColor: const Color(0xFF10B981), // Emerald
          ),
          const _CustomDivider(),
          _buildDetailRow(
            icon: Icons.receipt_long_outlined,
            label: 'Generated At',
            value: DateTime.now().toLocal().toString().split('.')[0], // Simplified display
            iconColor: const Color(0xFF8B5CF6), // Violet
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow({
    required IconData icon,
    required String label,
    required String value,
    required Color iconColor,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: iconColor.withOpacity(0.1), shape: BoxShape.circle),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(fontSize: 12, color: Colors.blueGrey.shade400, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 60,
      child: ElevatedButton.icon(
        onPressed: () => _handleLogout(context),
        icon: const Icon(Icons.power_settings_new_outlined, size: 20),
        label: const Text(
          'Sign Out',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.redAccent,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 3,
          shadowColor: Colors.redAccent.withOpacity(0.3),
        ),
      ),
    );
  }
}

// A custom divider that fits the visual style
class _CustomDivider extends StatelessWidget {
  const _CustomDivider();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4), // Slightly less vertical space for divider
      child: Divider(
        height: 1,
        color: const Color(0xFFF1F5F9), // Very light grey
        thickness: 1.5,
        indent: 50, // Start after the icon area
      ),
    );
  }
}