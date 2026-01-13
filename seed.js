require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected for seeding dynamic data...');

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Lesson.deleteMany();

    const instructorsData = [
      { name: 'Dr. Jane Smith', email: 'jane@skillsphere.com', password: 'password123', role: 'instructor' },
      { name: 'Alex Rivers', email: 'alex@skillsphere.com', password: 'password123', role: 'instructor' },
      { name: 'Sarah Chen', email: 'sarah@skillsphere.com', password: 'password123', role: 'instructor' },
      { name: 'Emma Stone', email: 'emma@skillsphere.com', password: 'password123', role: 'instructor' },
      { name: 'Mark Wilson', email: 'mark@skillsphere.com', password: 'password123', role: 'instructor' },
      { name: 'Sofia Rodriguez', email: 'sofia@skillsphere.com', password: 'password123', role: 'instructor' },
    ];

    // Use .create() instead of .insertMany() to trigger pre-save hooks (hashing password)
    const instructors = await User.create(instructorsData);
    console.log('6 Instructors created and passwords hashed.');

    const commonLessons = await Lesson.insertMany([
      { title: 'Introduction to the Course', videoUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', duration: '05:00', order: 1 },
      { title: 'Setting Up the Environment', videoUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', duration: '12:00', order: 2 },
      { title: 'Advanced Concepts Overview', videoUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', duration: '20:00', order: 3 },
    ]);

    const coursesData = [
      {
        title: 'Advanced React Architecture',
        description: 'Master the core concepts of React and build enterprise-level applications with patterns like Compound Components and Render Props.',
        category: 'Web Development',
        price: 99,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        instructorId: instructors[0]._id,
        lessons: [commonLessons[0]._id, commonLessons[1]._id],
        rating: 4.9
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Learn the principles of modern design, from typography to complex accessibility requirements using Figma and Adobe XD.',
        category: 'Design',
        price: 79,
        thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?auto=format&fit=crop&w=800&q=80',
        instructorId: instructors[1]._id,
        lessons: [commonLessons[0]._id, commonLessons[2]._id],
        rating: 4.8
      },
      {
        title: 'Fullstack Node.js Guide',
        description: 'Go beyond the basics of Express. Learn clustering, streams, and performance optimization in Node.js applications.',
        category: 'Web Development',
        price: 89,
        thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
        instructorId: instructors[2]._id,
        lessons: [commonLessons[1]._id, commonLessons[2]._id],
        rating: 4.9
      },
      {
        title: 'Python for Data Science',
        description: 'A comprehensive guide to Numpy, Pandas, and Matplotlib for data analysis and visualization in the real world.',
        category: 'Data Science',
        price: 95,
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        instructorId: instructors[3]._id,
        lessons: [commonLessons[0]._id, commonLessons[1]._id],
        rating: 4.7
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Understand the math behind Supervised and Unsupervised learning. Build models using Scikit-Learn.',
        category: 'Data Science',
        price: 120,
        thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
        instructorId: instructors[4]._id,
        lessons: [commonLessons[0]._id, commonLessons[2]._id],
        rating: 4.9
      },
      {
        title: 'Cybersecurity Essentials',
        description: 'Protect systems from common vulnerabilities. Learn ethical hacking and network security protocols.',
        category: 'Security',
        price: 110,
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        instructorId: instructors[5]._id,
        lessons: [commonLessons[1]._id, commonLessons[2]._id],
        rating: 4.6
      }
    ];

    await Course.insertMany(coursesData);
    console.log('6 Courses created.');

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
