import 'package:flutter/material.dart';
import '../models/login_response.dart';
import '../widgets/home_tab.dart';
import '../widgets/courses_tab.dart';
import '../widgets/profile_tab.dart';
import 'login_screen.dart';

// ---------------------------------------------------------------------------
// Nav item model
// ---------------------------------------------------------------------------
class _NavItem {
  final IconData icon;
  final String label;
  final String key;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.key,
  });
}

// ---------------------------------------------------------------------------
// Role-based nav items — mirrors frontend Sidebar.tsx
// ---------------------------------------------------------------------------
const _studentNav = [
  _NavItem(icon: Icons.dashboard_rounded,      label: 'Dashboard',      key: 'home'),
  _NavItem(icon: Icons.menu_book_rounded,      label: 'My Classes',     key: 'courses'),
  _NavItem(icon: Icons.calendar_month_rounded, label: 'Events',         key: 'events'),
  _NavItem(icon: Icons.person_off_rounded,     label: 'My Absences',    key: 'absences'),
  _NavItem(icon: Icons.credit_card_rounded,    label: 'Payments',       key: 'payments'),
  _NavItem(icon: Icons.notifications_rounded,  label: 'Notifications',  key: 'notifications'),
];

const _parentNav = [
  _NavItem(icon: Icons.dashboard_rounded,      label: 'Dashboard',      key: 'home'),
  _NavItem(icon: Icons.child_care_rounded,     label: 'My Children',    key: 'courses'),
  _NavItem(icon: Icons.person_off_rounded,     label: 'Absences',       key: 'absences'),
  _NavItem(icon: Icons.credit_card_rounded,    label: 'Payments',       key: 'payments'),
  _NavItem(icon: Icons.calendar_month_rounded, label: 'Events',         key: 'events'),
  _NavItem(icon: Icons.notifications_rounded,  label: 'Notifications',  key: 'notifications'),
];

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
class DashboardScreen extends StatefulWidget {
  final LoginResponse loginResponse;

  const DashboardScreen({super.key, required this.loginResponse});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  String _activeKey = 'home';

  bool get _isParent => widget.loginResponse.role == 'PARENT';
  List<_NavItem> get _navItems => _isParent ? _parentNav : _studentNav;
  String get _activeLabel =>
      _navItems.firstWhere((n) => n.key == _activeKey,
          orElse: () => const _NavItem(icon: Icons.circle, label: 'Profile', key: 'profile')).label;

  // -------------------------------------------------------------------------
  // Body switcher
  // -------------------------------------------------------------------------
  Widget _buildBody() {
    switch (_activeKey) {
      case 'home':
        return HomeTab(loginResponse: widget.loginResponse);
      case 'courses':
        return CoursesTab(loginResponse: widget.loginResponse);
      case 'profile':
        return ProfileTab(loginResponse: widget.loginResponse);
      default:
        // Empty page with just the title for unimplemented tabs
        return _EmptyTab(label: _activeLabel);
    }
  }

  // -------------------------------------------------------------------------
  // Logout
  // -------------------------------------------------------------------------
  void _logout() {
    Navigator.of(context).pop();
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (_) => false,
    );
  }

  // -------------------------------------------------------------------------
  // Build
  // -------------------------------------------------------------------------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: const Color(0xFFF0F4F8),
      appBar: _buildAppBar(),
      drawer: _buildDrawer(),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 220),
        switchInCurve: Curves.easeOut,
        switchOutCurve: Curves.easeIn,
        child: KeyedSubtree(
          key: ValueKey(_activeKey),
          child: _buildBody(),
        ),
      ),
    );
  }

  // -------------------------------------------------------------------------
  // AppBar
  // -------------------------------------------------------------------------
  PreferredSizeWidget _buildAppBar() {
    final showingProfile = _activeKey == 'profile';
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      scrolledUnderElevation: 0,
      leading: IconButton(
        tooltip: 'Open menu',
        onPressed: () => _scaffoldKey.currentState?.openDrawer(),
        icon: Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            color: const Color(0xFF0D1B2A).withOpacity(0.07),
            borderRadius: BorderRadius.circular(10),
          ),
          child: const Icon(Icons.menu_rounded, color: Color(0xFF0D1B2A), size: 20),
        ),
      ),
      title: Text(
        showingProfile ? 'Profile' : _activeLabel,
        style: const TextStyle(
          color: Color(0xFF0D1B2A),
          fontSize: 17,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.3,
        ),
      ),
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 16),
          child: GestureDetector(
            onTap: () => setState(() => _activeKey = 'profile'),
            child: Container(
              decoration: showingProfile
                  ? BoxDecoration(
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFF1565C0), width: 2),
                    )
                  : null,
              child: _Avatar(
                firstName: widget.loginResponse.firstName,
                lastName: widget.loginResponse.lastName,
                size: 38,
              ),
            ),
          ),
        ),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),
        child: Container(height: 1, color: const Color(0xFFE4EAF0)),
      ),
    );
  }

  // -------------------------------------------------------------------------
  // Drawer
  // -------------------------------------------------------------------------
  Widget _buildDrawer() {
    return Drawer(
      width: 272,
      backgroundColor: Colors.transparent,
      elevation: 0,
      child: Container(
        decoration: const BoxDecoration(color: Color(0xFF0F1C2E)),
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
                    ..._navItems.map((item) => _buildNavTile(item)),
                  ],
                ),
              ),
              _buildDivider(),
              _buildLogoutTile(),
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
                    colors: [Color(0xFF1565C0), Color(0xFF1976D2)],
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
                firstName: widget.loginResponse.firstName,
                lastName: widget.loginResponse.lastName,
                size: 50,
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${widget.loginResponse.firstName} ${widget.loginResponse.lastName}',
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        letterSpacing: -0.2,
                      ),
                    ),
                    const SizedBox(height: 5),
                    _RoleBadge(role: widget.loginResponse.role, isParent: _isParent),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildNavTile(_NavItem item) {
    final isActive = _activeKey == item.key;
    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(11),
        child: InkWell(
          borderRadius: BorderRadius.circular(11),
          onTap: () {
            setState(() => _activeKey = item.key);
            Navigator.of(context).pop();
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
            decoration: BoxDecoration(
              color: isActive
                  ? const Color(0xFF1565C0).withOpacity(0.18)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(11),
              border: isActive
                  ? Border.all(color: const Color(0xFF1976D2).withOpacity(0.3), width: 1)
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
                        ? const Color(0xFF1565C0).withOpacity(0.35)
                        : Colors.white.withOpacity(0.07),
                    borderRadius: BorderRadius.circular(9),
                  ),
                  child: Icon(
                    item.icon,
                    size: 17,
                    color: isActive
                        ? const Color(0xFF64B5F6)
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
                      color: Color(0xFF64B5F6),
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

  Widget _buildLogoutTile() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(10, 10, 10, 0),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(11),
        child: InkWell(
          borderRadius: BorderRadius.circular(11),
          onTap: _logout,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
            decoration: BoxDecoration(
              color: const Color(0xFFE63946).withOpacity(0.08),
              borderRadius: BorderRadius.circular(11),
              border: Border.all(color: const Color(0xFFE63946).withOpacity(0.2)),
            ),
            child: Row(
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE63946).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(9),
                  ),
                  child: const Icon(Icons.logout_rounded, size: 17, color: Color(0xFFE63946)),
                ),
                const SizedBox(width: 12),
                const Text(
                  'Log Out',
                  style: TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFFE63946),
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

// ---------------------------------------------------------------------------
// Avatar widget
// ---------------------------------------------------------------------------
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
          colors: [Color(0xFF1565C0), Color(0xFF1976D2)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(size * 0.28),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1565C0).withOpacity(0.4),
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

// ---------------------------------------------------------------------------
// Role badge
// ---------------------------------------------------------------------------
class _RoleBadge extends StatelessWidget {
  final String role;
  final bool isParent;

  const _RoleBadge({required this.role, required this.isParent});

  @override
  Widget build(BuildContext context) {
    final color = isParent ? const Color(0xFF66BB6A) : const Color(0xFF42A5F5);
    final bgColor = isParent ? const Color(0xFF2E7D32) : const Color(0xFF1565C0);
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

// ---------------------------------------------------------------------------
// Empty page — shown for unimplemented tabs (title only)
// ---------------------------------------------------------------------------
class _EmptyTab extends StatelessWidget {
  final String label;
  const _EmptyTab({required this.label});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        label,
        style: const TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          color: Color(0xFF0D1B2A),
          letterSpacing: -0.4,
        ),
      ),
    );
  }
}