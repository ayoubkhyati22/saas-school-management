import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../data/models/login_response.dart';
import '../../auth/screens/login_screen.dart';
import '../../home/screens/home_screen.dart';
import '../../courses/screens/courses_screen.dart';
import '../../profile/screens/profile_screen.dart';
import '../widgets/sidebar_menu.dart';
import '../widgets/bottom_nav_bar.dart';

class DashboardScreen extends StatefulWidget {
  final LoginResponse loginResponse;

  const DashboardScreen({super.key, required this.loginResponse});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  int _currentIndex = 0;
  String _activeKey = 'home';

  bool get _isParent => widget.loginResponse.role == 'PARENT';

  // Map bottom nav index to sidebar key
  static const _bottomNavKeys = ['home', 'courses', 'profile'];

  String get _activeLabel {
    switch (_activeKey) {
      case 'home':
        return 'Dashboard';
      case 'courses':
        return _isParent ? 'My Children' : 'My Classes';
      case 'profile':
        return 'Profile';
      case 'events':
        return 'Events';
      case 'absences':
        return _isParent ? 'Absences' : 'My Absences';
      case 'payments':
        return 'Payments';
      case 'notifications':
        return 'Notifications';
      default:
        return 'Dashboard';
    }
  }

  Widget _buildBody() {
    switch (_activeKey) {
      case 'home':
        return HomeScreen(loginResponse: widget.loginResponse);
      case 'courses':
        return CoursesScreen(loginResponse: widget.loginResponse);
      case 'profile':
        return ProfileScreen(loginResponse: widget.loginResponse);
      default:
        return _EmptyTab(label: _activeLabel);
    }
  }

  void _onBottomNavTap(int index) {
    setState(() {
      _currentIndex = index;
      _activeKey = _bottomNavKeys[index];
    });
  }

  void _onSidebarNavTap(String key) {
    setState(() {
      _activeKey = key;
      // Update bottom nav index if the key matches
      final bottomNavIndex = _bottomNavKeys.indexOf(key);
      if (bottomNavIndex != -1) {
        _currentIndex = bottomNavIndex;
      }
    });
  }

  void _logout() {
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (_) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final showingProfile = _activeKey == 'profile';

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppColors.backgroundDark,
      appBar: _buildAppBar(showingProfile),
      drawer: SidebarMenu(
        loginResponse: widget.loginResponse,
        activeKey: _activeKey,
        onNavItemTap: _onSidebarNavTap,
        onLogout: _logout,
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 220),
        switchInCurve: Curves.easeOut,
        switchOutCurve: Curves.easeIn,
        child: KeyedSubtree(
          key: ValueKey(_activeKey),
          child: _buildBody(),
        ),
      ),
      bottomNavigationBar: BottomNavBar(
        currentIndex: _currentIndex,
        onTap: _onBottomNavTap,
      ),
    );
  }

  PreferredSizeWidget _buildAppBar(bool showingProfile) {
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
            color: AppColors.sidebarDark.withOpacity(0.07),
            borderRadius: BorderRadius.circular(10),
          ),
          child: const Icon(Icons.menu_rounded, color: AppColors.sidebarDark, size: 20),
        ),
      ),
      title: Text(
        showingProfile ? 'Profile' : _activeLabel,
        style: const TextStyle(
          color: AppColors.sidebarDark,
          fontSize: 17,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.3,
        ),
      ),
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 16),
          child: GestureDetector(
            onTap: () => _onBottomNavTap(2), // Navigate to profile
            child: Container(
              decoration: showingProfile
                  ? BoxDecoration(
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.primary, width: 2),
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
        child: Container(height: 1, color: AppColors.divider),
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

/// Empty page for unimplemented sidebar tabs
class _EmptyTab extends StatelessWidget {
  final String label;
  const _EmptyTab({required this.label});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.construction_rounded,
            size: 64,
            color: Colors.blueGrey.shade200,
          ),
          const SizedBox(height: 16),
          Text(
            label,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.sidebarDark,
              letterSpacing: -0.4,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Coming soon',
            style: TextStyle(
              fontSize: 14,
              color: Colors.blueGrey.shade400,
            ),
          ),
        ],
      ),
    );
  }
}
