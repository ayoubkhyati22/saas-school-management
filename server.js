const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRATION = '24h';
const REFRESH_TOKEN_EXPIRATION = '7d';

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRATION }
  );

  return { accessToken, refreshToken };
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error || !users) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isValidPassword = await bcrypt.compare(password, users.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const { accessToken, refreshToken } = generateTokens(users);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.first_name,
          lastName: users.last_name,
          role: users.role,
          schoolId: users.school_id,
          phoneNumber: users.phone,
          enabled: users.enabled,
          createdAt: users.created_at,
          updatedAt: users.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        password: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role: role || 'SCHOOL_ADMIN',
        enabled: true
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    const { accessToken, refreshToken } = generateTokens(newUser);

    res.json({
      success: true,
      message: 'Registration successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          role: newUser.role,
          schoolId: newUser.school_id,
          phoneNumber: newUser.phone,
          enabled: newUser.enabled,
          createdAt: newUser.created_at,
          updatedAt: newUser.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    jwt.verify(refreshToken, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.id)
        .single();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const { accessToken } = generateTokens(user);

      res.json({
        success: true,
        data: { accessToken }
      });
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/schools', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 10;
    const from = page * size;
    const to = from + size - 1;

    const { data, error, count } = await supabase
      .from('schools')
      .select('*', { count: 'exact' })
      .range(from, to);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Schools fetched successfully',
      data: {
        content: data,
        page,
        size,
        totalElements: count,
        totalPages: Math.ceil(count / size),
        number: page
      }
    });
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 10;
    const from = page * size;
    const to = from + size - 1;

    const { data, error, count } = await supabase
      .from('students')
      .select(`
        *,
        user:users(*)
      `, { count: 'exact' })
      .range(from, to);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Students fetched successfully',
      data: {
        content: data,
        page,
        size,
        totalElements: count,
        totalPages: Math.ceil(count / size),
        number: page
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/dashboard/super-admin', authenticateToken, async (req, res) => {
  try {
    const { count: schoolsCount } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true });

    const { count: subscriptionsCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ACTIVE');

    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    res.json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: {
        totalSchools: schoolsCount || 0,
        activeSubscriptions: subscriptionsCount || 0,
        totalUsers: usersCount || 0,
        totalRevenue: 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/dashboard/school-admin', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.schoolId;

    if (!schoolId) {
      return res.status(400).json({
        success: false,
        message: 'School ID not found'
      });
    }

    const { count: studentsCount } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId);

    const { count: teachersCount } = await supabase
      .from('teachers')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolId);

    res.json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: {
        totalStudents: studentsCount || 0,
        totalTeachers: teachersCount || 0,
        attendanceRate: 0,
        pendingPayments: 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log('🚀 School SaaS API Server');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔗 Supabase URL: ${process.env.VITE_SUPABASE_URL}`);
  console.log(`${'='.repeat(60)}\n`);
});
