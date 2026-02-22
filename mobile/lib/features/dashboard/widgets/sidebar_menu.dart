import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../data/models/login_response.dart';

/// Navigation item model for sidebar
class NavItem {
  final IconData icon;
  final String label;
  final String key;

  const NavItem({
    required this.icon,
    required this.label,
    required this.key,
  });
}

/// Role-based navigation items
const studentNav = [
  NavItem(icon: Icons.dashboard_rounded, label: 'Dashboard', key: 'home'),
  NavItem(icon: Icons.menu_book_rounded, label: 'My Classes', key: 'courses'),
  NavItem(icon: Icons.calendar_month_rounded, label: 'Events', key: 'events'),
  NavItem(icon: Icons.person_off_rounded, label: 'My Absences', key: 'absences'),
  NavItem(icon: Icons.credit_card_rounded, label: 'Payments', key: 'payments'),
  NavItem(icon: Icons.notifications_rounded, label: 'Notifications', key: 'notifications'),
];

const parentNav = [
  NavItem(icon: Icons.dashboard_rounded, label: 'Dashboard', key: 'home'),
  NavItem(icon: Icons.child_care_rounded, label: 'My Children', key: 'courses'),
  NavItem(icon: Icons.person_off_rounded, label: 'Absences', key: 'absences'),
  NavItem(icon: Icons.credit_card_rounded, label: 'Payments', key: 'payments'),
  NavItem(icon: Icons.calendar_month_rounded, label: 'Events', key: 'events'),
  NavItem(icon: Icons.notifications_rounded, label: 'Notifications', key: 'notifications'),
];

class SidebarMenu extends StatelessWidget {
  final LoginResponse loginResponse;
  final String activeKey;
  final ValueChanged<String> onNavItemTap;
  final VoidCallback onLogout;

  const SidebarMenu({
    super.key,
    required this.loginResponse,
    required this.activeKey,
    required this.onNavItemTap,
    required this.onLogout,
  });

  bool get _isParent => loginResponse.role == 'PARENT';
  List<NavItem> get _navItems => _isParent ? parentNav : studentNav;

  @override
  Widget build(BuildContext context) {
    return Drawer(
      width: 272,
      backgroundColor: Colors.transparent,
      elevation: 0,
      child: Container(
        decoration: const BoxDecoration(color: AppColors.sidebarBackground),
        child: SafeArea(
          child: Column(
            children: [
              _buildDrawerHeader(),
              _buildDivider(),
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.fromLTRB(10, 10, 10, 0),
                  children: [
                    _sectionLabel('MENU'),
                    const SizedBox(height: 4),
                    ..._navItems.map((item) => _buildNavTile(context, item)),
                  ],
                ),
              ),
              _buildDivider(),
              _buildLogoutTile(context),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDrawerHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 22, 18, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Brand
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppColors.primary, AppColors.primaryLight],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(9),
                ),
                child: const Icon(Icons.school_rounded, color: Colors.white, size: 18),
              ),
              const SizedBox(width: 10),
              const Text(
                'School SaaS',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.2,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          // User row
          Row(
            children: [
              _Avatar(
                firstName: loginResponse.firstName,
                lastName: loginResponse.lastName,
                size: 50,
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${loginResponse.firstName} ${loginResponse.lastName}',
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        letterSpacing: -0.2,
                      ),
                    ),
                    const SizedBox(height: 5),
                    _RoleBadge(role: loginResponse.role, isParent: _isParent),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildNavTile(BuildContext context, NavItem item) {
    final isActive = activeKey == item.key;
    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(11),
        child: InkWell(
          borderRadius: BorderRadius.circular(11),
          onTap: () {
            onNavItemTap(item.key);
            Navigator.of(context).pop();
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
            decoration: BoxDecoration(
              color: isActive
                  ? AppColors.primary.withOpacity(0.18)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(11),
              border: isActive
                  ? Border.all(color: AppColors.primaryLight.withOpacity(0.3), width: 1)
                  : null,
            ),
            child: Row(
              children: [
                AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: isActive
                        ? AppColors.primary.withOpacity(0.35)
                        : Colors.white.withOpacity(0.07),
                    borderRadius: BorderRadius.circular(9),
                  ),
                  child: Icon(
                    item.icon,
                    size: 17,
                    color: isActive
                        ? AppColors.lightBlue
                        : Colors.white.withOpacity(0.5),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    item.label,
                    style: TextStyle(
                      fontSize: 13.5,
                      fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                      color: isActive ? Colors.white : Colors.white.withOpacity(0.62),
                      letterSpacing: -0.1,
                    ),
                  ),
                ),
                if (isActive)
                  Container(
                    width: 6,
                    height: 6,
                    decoration: const BoxDecoration(
                      color: AppColors.lightBlue,
                      shape: BoxShape.circle,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLogoutTile(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(10, 10, 10, 0),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(11),
        child: InkWell(
          borderRadius: BorderRadius.circular(11),
          onTap: onLogout,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
            decoration: BoxDecoration(
              color: AppColors.error.withOpacity(0.08),
              borderRadius: BorderRadius.circular(11),
              border: Border.all(color: AppColors.error.withOpacity(0.2)),
            ),
            child: Row(
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(9),
                  ),
                  child: const Icon(Icons.logout_rounded, size: 17, color: AppColors.error),
                ),
                const SizedBox(width: 12),
                const Text(
                  'Log Out',
                  style: TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w600,
                    color: AppColors.error,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18),
      child: Divider(height: 1, color: Colors.white.withOpacity(0.08)),
    );
  }

  Widget _sectionLabel(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 10.5,
          fontWeight: FontWeight.w700,
          color: Colors.white.withOpacity(0.28),
          letterSpacing: 1.6,
        ),
      ),
    );
  }
}

/// Avatar widget
class _Avatar extends StatelessWidget {
  final String firstName;
  final String lastName;
  final double size;

  const _Avatar({required this.firstName, required this.lastName, required this.size});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primary, AppColors.primaryLight],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(size * 0.28),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.4),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Center(
        child: Text(
          '${firstName[0]}${lastName[0]}'.toUpperCase(),
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w800,
            fontSize: size * 0.34,
          ),
        ),
      ),
    );
  }
}

/// Role badge widget
class _RoleBadge extends StatelessWidget {
  final String role;
  final bool isParent;

  const _RoleBadge({required this.role, required this.isParent});

  @override
  Widget build(BuildContext context) {
    final color = isParent ? const Color(0xFF66BB6A) : const Color(0xFF42A5F5);
    final bgColor = isParent ? const Color(0xFF2E7D32) : AppColors.primary;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bgColor.withOpacity(0.22),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withOpacity(0.35)),
      ),
      child: Text(
        role,
        style: TextStyle(
          fontSize: 10.5,
          fontWeight: FontWeight.w700,
          color: color,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
