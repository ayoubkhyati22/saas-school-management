import 'package:flutter/material.dart';

/// Centralized color palette for the app
class AppColors {
  AppColors._();

  // Primary Colors
  static const Color primary = Color(0xFF1565C0);
  static const Color primaryLight = Color(0xFF1976D2);
  static const Color primaryDark = Color(0xFF0D47A1);

  // Background Colors
  static const Color background = Color(0xFFF8FAFC);
  static const Color backgroundDark = Color(0xFFF0F4F8);
  static const Color surface = Colors.white;

  // Sidebar Colors
  static const Color sidebarBackground = Color(0xFF0F1C2E);
  static const Color sidebarDark = Color(0xFF0D1B2A);

  // Text Colors
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF1E293B);
  static const Color textMuted = Color(0xFF64748B);
  static const Color textLight = Color(0xFFCBD5E1);

  // Accent Colors
  static const Color indigo = Color(0xFF6366F1);
  static const Color emerald = Color(0xFF10B981);
  static const Color violet = Color(0xFF8B5CF6);
  static const Color amber = Color(0xFFF59E0B);
  static const Color blue = Color(0xFF3B82F6);
  static const Color lightBlue = Color(0xFF64B5F6);

  // Status Colors
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFE63946);
  static const Color warning = Color(0xFFF59E0B);

  // Divider & Border Colors
  static const Color divider = Color(0xFFE4EAF0);
  static const Color dividerLight = Color(0xFFF1F5F9);

  // Accent Colors List (for cycling through items)
  static const List<Color> accentColors = [
    indigo,
    emerald,
    violet,
    amber,
    blue,
  ];
}
