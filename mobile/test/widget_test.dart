// This is a basic Flutter widget test.

import 'package:flutter_test/flutter_test.dart';

import 'package:school_management_app/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const SchoolManagementApp());

    // Verify that the login screen is displayed
    expect(find.text('EduConnect'), findsOneWidget);
    expect(find.text('Welcome Back'), findsOneWidget);
  });
}
