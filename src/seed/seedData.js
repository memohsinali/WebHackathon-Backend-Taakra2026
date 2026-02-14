import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import Category from '../models/Category.js';
import Competition from '../models/Competition.js';
import User from '../models/User.js';
import logger from '../config/logger.js';

dotenv.config();

// Categories array
const categories = [
  { name: 'Ceremony', description: 'Ceremonial events and activities' },
  { name: 'Literary', description: 'Literary and writing competitions' },
  { name: 'Model United Nations', description: 'MUN conferences and debates' },
  { name: 'Arts', description: 'Arts and creative competitions' },
  { name: 'Gaming', description: 'Gaming competitions and tournaments' },
  { name: 'Sports', description: 'Sports and physical activities' },
  { name: 'Entertainment', description: 'Entertainment and performance events' },
  { name: 'Music', description: 'Music and musical performances' },
  { name: 'Photography', description: 'Photography competitions' },
  { name: 'Islamic', description: 'Islamic competitions and activities' },
  { name: 'Technology', description: 'Technology and coding competitions' },
  { name: 'Business', description: 'Business and entrepreneurship events' },
  { name: 'Engineering', description: 'Engineering and technical competitions' },
  { name: 'Moot Court', description: 'Moot court and legal competitions' },
  { name: 'Fun Activities', description: 'Fun activities and games' }
];

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@taakra.com',
    password: '123456',
    role: 'admin',
    phoneNumber: '+92-300-1234567'
  },
  {
    name: 'Support User',
    email: 'support@taakra.com',
    password: '123456',
    role: 'support',
    phoneNumber: '+92-300-1234568'
  },
  {
    name: 'Test User',
    email: 'user@taakra.com',
    password: '123456',
    role: 'user',
    phoneNumber: '+92-300-1234569'
  }
];

// Competition data for all 5 days
const getCompetitions = (categoryMap) => [
  // DAY 1 - February 11, 2025 (Ceremony Day)
  {
    title: 'Entrance from Gate 4',
    description: 'Grand entrance ceremony for all participants',
    category: categoryMap['Ceremony'],
    venue: 'Main Gate 4',
    building: 'Main Campus',
    startDate: new Date('2025-02-11T08:00:00'),
    endDate: new Date('2025-02-11T09:00:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },
  {
    title: 'National Anthem',
    description: 'National Anthem ceremony',
    category: categoryMap['Ceremony'],
    venue: 'Main Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-11T09:00:00'),
    endDate: new Date('2025-02-11T09:15:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },
  {
    title: 'Recitation',
    description: 'Holy Quran recitation',
    category: categoryMap['Islamic'],
    venue: 'Main Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-11T09:15:00'),
    endDate: new Date('2025-02-11T09:30:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },
  {
    title: 'Introduction by MOC',
    description: 'Introduction by Master of Ceremony',
    category: categoryMap['Ceremony'],
    venue: 'Main Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-11T09:30:00'),
    endDate: new Date('2025-02-11T09:45:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },
  {
    title: 'Welcome Note',
    description: 'Welcome address to all participants',
    category: categoryMap['Ceremony'],
    venue: 'Main Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-11T09:45:00'),
    endDate: new Date('2025-02-11T10:00:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },
  {
    title: 'Core Team Introduction',
    description: 'Introduction of TAAKRA core team members',
    category: categoryMap['Ceremony'],
    venue: 'Main Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-11T10:00:00'),
    endDate: new Date('2025-02-11T10:20:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },
  {
    title: 'Shield to Event Heads',
    description: 'Shield presentation to event heads',
    category: categoryMap['Ceremony'],
    venue: 'Main Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-11T10:20:00'),
    endDate: new Date('2025-02-11T10:40:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },
  {
    title: 'Note by Mr. Muhammad Yaqoob',
    description: 'Special note by Mr. Muhammad Yaqoob',
    category: categoryMap['Ceremony'],
    venue: 'Main Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-11T10:40:00'),
    endDate: new Date('2025-02-11T11:00:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },
  {
    title: 'Taakra Highlight 2025',
    description: 'Highlights and achievements of TAAKRA 2025',
    category: categoryMap['Ceremony'],
    venue: 'Main Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-11T11:00:00'),
    endDate: new Date('2025-02-11T11:30:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },
  {
    title: 'Shield to Campus Ambassadors',
    description: 'Shield presentation to campus ambassadors',
    category: categoryMap['Ceremony'],
    venue: 'Main Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-11T11:30:00'),
    endDate: new Date('2025-02-11T12:00:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },
  {
    title: 'Note of Thanks',
    description: 'Vote of thanks to all participants and organizers',
    category: categoryMap['Ceremony'],
    venue: 'Main Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-11T12:00:00'),
    endDate: new Date('2025-02-11T12:15:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },
  {
    title: 'Trophy Reveal',
    description: 'Grand reveal of TAAKRA trophy',
    category: categoryMap['Ceremony'],
    venue: 'Main Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-11T12:15:00'),
    endDate: new Date('2025-02-11T12:30:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },
  {
    title: 'Cake Cutting Ceremony',
    description: 'TAAKRA cake cutting ceremony',
    category: categoryMap['Ceremony'],
    venue: 'Main Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-11T12:30:00'),
    endDate: new Date('2025-02-11T12:45:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },
  {
    title: 'Hi-Tea',
    description: 'Hi-tea and networking session',
    category: categoryMap['Ceremony'],
    venue: 'Lawn Area',
    building: 'Main Campus',
    startDate: new Date('2025-02-11T12:45:00'),
    endDate: new Date('2025-02-11T14:00:00'),
    dayNumber: 1,
    maxParticipants: 1000,
    registrationDeadline: new Date('2025-02-10T23:59:59')
  },

  // DAY 2 - February 12, 2025
  {
    title: 'NeuroPedia',
    description: 'Neuroscience and medical knowledge quiz competition',
    category: categoryMap['Technology'],
    venue: 'Room 201',
    building: 'Academic Block',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T12:00:00'),
    dayNumber: 2,
    maxParticipants: 50,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Realm Poetry Slam - English',
    description: 'English poetry slam competition',
    category: categoryMap['Literary'],
    venue: 'Seminar Hall 1',
    building: 'Academic Block',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T11:00:00'),
    dayNumber: 2,
    maxParticipants: 30,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Realm Poetry Slam - Ghazal',
    description: 'Ghazal poetry competition',
    category: categoryMap['Literary'],
    venue: 'Seminar Hall 2',
    building: 'Academic Block',
    startDate: new Date('2025-02-12T11:30:00'),
    endDate: new Date('2025-02-12T13:30:00'),
    dayNumber: 2,
    maxParticipants: 30,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Realm Poetry Slam - Nazam',
    description: 'Nazam poetry competition',
    category: categoryMap['Literary'],
    venue: 'Seminar Hall 2',
    building: 'Academic Block',
    startDate: new Date('2025-02-12T14:00:00'),
    endDate: new Date('2025-02-12T16:00:00'),
    dayNumber: 2,
    maxParticipants: 30,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'MUN - PNA',
    description: 'Model United Nations - Pakistan National Assembly',
    category: categoryMap['Model United Nations'],
    venue: 'Conference Hall A',
    building: 'Conference Center',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T18:00:00'),
    dayNumber: 2,
    maxParticipants: 60,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'MUN - UNGA',
    description: 'Model United Nations - United Nations General Assembly',
    category: categoryMap['Model United Nations'],
    venue: 'Conference Hall B',
    building: 'Conference Center',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T18:00:00'),
    dayNumber: 2,
    maxParticipants: 80,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'MUN - UNSC',
    description: 'Model United Nations - United Nations Security Council',
    category: categoryMap['Model United Nations'],
    venue: 'Conference Hall C',
    building: 'Conference Center',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T18:00:00'),
    dayNumber: 2,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Bilingual Declamation',
    description: 'Bilingual public speaking competition',
    category: categoryMap['Literary'],
    venue: 'Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-12T10:00:00'),
    endDate: new Date('2025-02-12T13:00:00'),
    dayNumber: 2,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Sketching',
    description: 'Live sketching competition',
    category: categoryMap['Arts'],
    venue: 'Art Studio',
    building: 'Arts Block',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T12:00:00'),
    dayNumber: 2,
    maxParticipants: 50,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'FIFA 26',
    description: 'FIFA 26 gaming tournament',
    category: categoryMap['Gaming'],
    venue: 'Gaming Arena',
    building: 'Sports Complex',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T15:00:00'),
    dayNumber: 2,
    maxParticipants: 32,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Sumo War',
    description: 'Sumo wrestling entertainment event',
    category: categoryMap['Fun Activities'],
    venue: 'Sports Ground',
    building: 'Sports Complex',
    startDate: new Date('2025-02-12T11:00:00'),
    endDate: new Date('2025-02-12T14:00:00'),
    dayNumber: 2,
    maxParticipants: 20,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Laughter Disaster',
    description: 'Stand-up comedy and entertainment show',
    category: categoryMap['Entertainment'],
    venue: 'Open Air Theater',
    building: 'Main Campus',
    startDate: new Date('2025-02-12T14:00:00'),
    endDate: new Date('2025-02-12T16:00:00'),
    dayNumber: 2,
    maxParticipants: 100,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Instrumentals',
    description: 'Instrumental music competition',
    category: categoryMap['Music'],
    venue: 'Music Hall',
    building: 'Arts Block',
    startDate: new Date('2025-02-12T10:00:00'),
    endDate: new Date('2025-02-12T13:00:00'),
    dayNumber: 2,
    maxParticipants: 30,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Western Complete',
    description: 'Western music performance competition',
    category: categoryMap['Music'],
    venue: 'Music Hall',
    building: 'Arts Block',
    startDate: new Date('2025-02-12T14:00:00'),
    endDate: new Date('2025-02-12T17:00:00'),
    dayNumber: 2,
    maxParticipants: 25,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Rap Wars',
    description: 'Rap battle competition',
    category: categoryMap['Music'],
    venue: 'Open Air Theater',
    building: 'Main Campus',
    startDate: new Date('2025-02-12T16:30:00'),
    endDate: new Date('2025-02-12T18:30:00'),
    dayNumber: 2,
    maxParticipants: 20,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'DSLR Photography',
    description: 'DSLR photography competition',
    category: categoryMap['Photography'],
    venue: 'Campus Wide',
    building: 'Main Campus',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T17:00:00'),
    dayNumber: 2,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Mobile Photography',
    description: 'Mobile photography competition',
    category: categoryMap['Photography'],
    venue: 'Campus Wide',
    building: 'Main Campus',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T17:00:00'),
    dayNumber: 2,
    maxParticipants: 60,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Documentary',
    description: 'Documentary film competition',
    category: categoryMap['Photography'],
    venue: 'Media Lab',
    building: 'Technology Block',
    startDate: new Date('2025-02-12T10:00:00'),
    endDate: new Date('2025-02-12T16:00:00'),
    dayNumber: 2,
    maxParticipants: 20,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Table Tennis',
    description: 'Table tennis tournament',
    category: categoryMap['Sports'],
    venue: 'Sports Hall',
    building: 'Sports Complex',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T15:00:00'),
    dayNumber: 2,
    maxParticipants: 32,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Qirat - Male',
    description: 'Quran recitation competition for males',
    category: categoryMap['Islamic'],
    venue: 'Mosque',
    building: 'Main Campus',
    startDate: new Date('2025-02-12T11:00:00'),
    endDate: new Date('2025-02-12T13:00:00'),
    dayNumber: 2,
    maxParticipants: 20,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Qirat - Female',
    description: 'Quran recitation competition for females',
    category: categoryMap['Islamic'],
    venue: 'Seminar Hall 3',
    building: 'Academic Block',
    startDate: new Date('2025-02-12T11:00:00'),
    endDate: new Date('2025-02-12T13:00:00'),
    dayNumber: 2,
    maxParticipants: 20,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Azaan',
    description: 'Call to prayer (Azaan) competition',
    category: categoryMap['Islamic'],
    venue: 'Mosque',
    building: 'Main Campus',
    startDate: new Date('2025-02-12T13:30:00'),
    endDate: new Date('2025-02-12T15:00:00'),
    dayNumber: 2,
    maxParticipants: 15,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Speed Wiring',
    description: 'Electrical circuit wiring speed competition',
    category: categoryMap['Engineering'],
    venue: 'Electrical Lab',
    building: 'Engineering Block',
    startDate: new Date('2025-02-12T10:00:00'),
    endDate: new Date('2025-02-12T13:00:00'),
    dayNumber: 2,
    maxParticipants: 30,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Cricket',
    description: 'Cricket tournament',
    category: categoryMap['Sports'],
    venue: 'Cricket Ground',
    building: 'Sports Complex',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T18:00:00'),
    dayNumber: 2,
    maxParticipants: 88,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Chess',
    description: 'Chess tournament',
    category: categoryMap['Gaming'],
    venue: 'Library Hall',
    building: 'Library',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T16:00:00'),
    dayNumber: 2,
    maxParticipants: 32,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'National Moot Competition',
    description: 'National level moot court competition',
    category: categoryMap['Moot Court'],
    venue: 'Law Court Room',
    building: 'Law Block',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T18:00:00'),
    dayNumber: 2,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Fly Your Own Plane',
    description: 'Model aircraft flying competition',
    category: categoryMap['Engineering'],
    venue: 'Open Field',
    building: 'Sports Complex',
    startDate: new Date('2025-02-12T14:00:00'),
    endDate: new Date('2025-02-12T17:00:00'),
    dayNumber: 2,
    maxParticipants: 25,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Mini House Design',
    description: 'Miniature house design and architecture competition',
    category: categoryMap['Engineering'],
    venue: 'Design Studio',
    building: 'Engineering Block',
    startDate: new Date('2025-02-12T09:00:00'),
    endDate: new Date('2025-02-12T15:00:00'),
    dayNumber: 2,
    maxParticipants: 30,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },

  // DAY 3 - February 13, 2025
  {
    title: 'Rhetoric - English',
    description: 'English rhetoric and public speaking competition',
    category: categoryMap['Literary'],
    venue: 'Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-13T09:00:00'),
    endDate: new Date('2025-02-13T12:00:00'),
    dayNumber: 3,
    maxParticipants: 30,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Rhetoric - Urdu',
    description: 'Urdu rhetoric and public speaking competition',
    category: categoryMap['Literary'],
    venue: 'Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-13T13:00:00'),
    endDate: new Date('2025-02-13T16:00:00'),
    dayNumber: 3,
    maxParticipants: 30,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Master Chef',
    description: 'Cooking competition',
    category: categoryMap['Fun Activities'],
    venue: 'Cafeteria Kitchen',
    building: 'Student Center',
    startDate: new Date('2025-02-13T10:00:00'),
    endDate: new Date('2025-02-13T14:00:00'),
    dayNumber: 3,
    maxParticipants: 20,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'YES - Young Entrepreneurs Summit',
    description: 'Business plan and entrepreneurship competition',
    category: categoryMap['Business'],
    venue: 'Business Lab',
    building: 'Business Block',
    startDate: new Date('2025-02-13T09:00:00'),
    endDate: new Date('2025-02-13T15:00:00'),
    dayNumber: 3,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Speed Programming',
    description: 'Fast-paced programming competition',
    category: categoryMap['Technology'],
    venue: 'Computer Lab 1',
    building: 'Technology Block',
    startDate: new Date('2025-02-13T10:00:00'),
    endDate: new Date('2025-02-13T13:00:00'),
    dayNumber: 3,
    maxParticipants: 50,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'CTF Coding',
    description: 'Capture the Flag cybersecurity competition',
    category: categoryMap['Technology'],
    venue: 'Computer Lab 2',
    building: 'Technology Block',
    startDate: new Date('2025-02-13T09:00:00'),
    endDate: new Date('2025-02-13T17:00:00'),
    dayNumber: 3,
    maxParticipants: 60,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Painting',
    description: 'Live painting competition',
    category: categoryMap['Arts'],
    venue: 'Art Studio',
    building: 'Arts Block',
    startDate: new Date('2025-02-13T09:00:00'),
    endDate: new Date('2025-02-13T14:00:00'),
    dayNumber: 3,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'MUN - Day 2',
    description: 'Model United Nations - Second Day',
    category: categoryMap['Model United Nations'],
    venue: 'Conference Center',
    building: 'Conference Center',
    startDate: new Date('2025-02-13T09:00:00'),
    endDate: new Date('2025-02-13T18:00:00'),
    dayNumber: 3,
    maxParticipants: 180,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Eastern',
    description: 'Eastern music and cultural performance',
    category: categoryMap['Music'],
    venue: 'Music Hall',
    building: 'Arts Block',
    startDate: new Date('2025-02-13T14:00:00'),
    endDate: new Date('2025-02-13T17:00:00'),
    dayNumber: 3,
    maxParticipants: 30,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Dekh Tamasha',
    description: 'Drama and theatrical performance competition',
    category: categoryMap['Entertainment'],
    venue: 'Open Air Theater',
    building: 'Main Campus',
    startDate: new Date('2025-02-13T10:00:00'),
    endDate: new Date('2025-02-13T16:00:00'),
    dayNumber: 3,
    maxParticipants: 50,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Monologue',
    description: 'Solo theatrical performance competition',
    category: categoryMap['Entertainment'],
    venue: 'Seminar Hall 1',
    building: 'Academic Block',
    startDate: new Date('2025-02-13T11:00:00'),
    endDate: new Date('2025-02-13T14:00:00'),
    dayNumber: 3,
    maxParticipants: 25,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'DSLR Photography - Day 2',
    description: 'DSLR photography competition continues',
    category: categoryMap['Photography'],
    venue: 'Campus Wide',
    building: 'Main Campus',
    startDate: new Date('2025-02-13T09:00:00'),
    endDate: new Date('2025-02-13T17:00:00'),
    dayNumber: 3,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Mobile Photography - Day 2',
    description: 'Mobile photography competition continues',
    category: categoryMap['Photography'],
    venue: 'Campus Wide',
    building: 'Main Campus',
    startDate: new Date('2025-02-13T09:00:00'),
    endDate: new Date('2025-02-13T17:00:00'),
    dayNumber: 3,
    maxParticipants: 60,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Short Films',
    description: 'Short film making competition',
    category: categoryMap['Photography'],
    venue: 'Media Lab',
    building: 'Technology Block',
    startDate: new Date('2025-02-13T10:00:00'),
    endDate: new Date('2025-02-13T17:00:00'),
    dayNumber: 3,
    maxParticipants: 25,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Swimming 50M',
    description: '50 meter swimming race',
    category: categoryMap['Sports'],
    venue: 'Swimming Pool',
    building: 'Sports Complex',
    startDate: new Date('2025-02-13T09:00:00'),
    endDate: new Date('2025-02-13T12:00:00'),
    dayNumber: 3,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Futsal',
    description: 'Indoor football tournament',
    category: categoryMap['Sports'],
    venue: 'Indoor Sports Hall',
    building: 'Sports Complex',
    startDate: new Date('2025-02-13T09:00:00'),
    endDate: new Date('2025-02-13T18:00:00'),
    dayNumber: 3,
    maxParticipants: 80,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Badminton',
    description: 'Badminton tournament',
    category: categoryMap['Sports'],
    venue: 'Badminton Court',
    building: 'Sports Complex',
    startDate: new Date('2025-02-13T09:00:00'),
    endDate: new Date('2025-02-13T17:00:00'),
    dayNumber: 3,
    maxParticipants: 32,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Naat - Male',
    description: 'Naat recitation competition for males',
    category: categoryMap['Islamic'],
    venue: 'Mosque',
    building: 'Main Campus',
    startDate: new Date('2025-02-13T11:00:00'),
    endDate: new Date('2025-02-13T13:00:00'),
    dayNumber: 3,
    maxParticipants: 20,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Naat - Female',
    description: 'Naat recitation competition for females',
    category: categoryMap['Islamic'],
    venue: 'Seminar Hall 3',
    building: 'Academic Block',
    startDate: new Date('2025-02-13T11:00:00'),
    endDate: new Date('2025-02-13T13:00:00'),
    dayNumber: 3,
    maxParticipants: 20,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'National Moot Competition - Day 2',
    description: 'National moot court competition continues',
    category: categoryMap['Moot Court'],
    venue: 'Law Court Room',
    building: 'Law Block',
    startDate: new Date('2025-02-13T09:00:00'),
    endDate: new Date('2025-02-13T18:00:00'),
    dayNumber: 3,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Tekken 8',
    description: 'Tekken 8 fighting game tournament',
    category: categoryMap['Gaming'],
    venue: 'Gaming Arena',
    building: 'Sports Complex',
    startDate: new Date('2025-02-13T10:00:00'),
    endDate: new Date('2025-02-13T16:00:00'),
    dayNumber: 3,
    maxParticipants: 32,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Eco 3D Models',
    description: 'Eco-friendly 3D model design competition',
    category: categoryMap['Engineering'],
    venue: 'Design Studio',
    building: 'Engineering Block',
    startDate: new Date('2025-02-13T09:00:00'),
    endDate: new Date('2025-02-13T17:00:00'),
    dayNumber: 3,
    maxParticipants: 35,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Solid Works',
    description: 'SolidWorks CAD design competition',
    category: categoryMap['Engineering'],
    venue: 'CAD Lab',
    building: 'Engineering Block',
    startDate: new Date('2025-02-13T10:00:00'),
    endDate: new Date('2025-02-13T15:00:00'),
    dayNumber: 3,
    maxParticipants: 30,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Pickleball',
    description: 'Pickleball tournament',
    category: categoryMap['Sports'],
    venue: 'Tennis Court',
    building: 'Sports Complex',
    startDate: new Date('2025-02-13T14:00:00'),
    endDate: new Date('2025-02-13T18:00:00'),
    dayNumber: 3,
    maxParticipants: 24,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },

  // DAY 4 - February 14, 2025
  {
    title: 'Calligraphy',
    description: 'Islamic and artistic calligraphy competition',
    category: categoryMap['Arts'],
    venue: 'Art Studio',
    building: 'Arts Block',
    startDate: new Date('2025-02-14T09:00:00'),
    endDate: new Date('2025-02-14T13:00:00'),
    dayNumber: 4,
    maxParticipants: 35,
    registrationDeadline: new Date('2025-02-13T23:59:59')
  },
  {
    title: 'National Moot Competition - Day 3',
    description: 'National moot court competition continues',
    category: categoryMap['Moot Court'],
    venue: 'Law Court Room',
    building: 'Law Block',
    startDate: new Date('2025-02-14T09:00:00'),
    endDate: new Date('2025-02-14T18:00:00'),
    dayNumber: 4,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'MUN - Day 3',
    description: 'Model United Nations - Third Day',
    category: categoryMap['Model United Nations'],
    venue: 'Conference Center',
    building: 'Conference Center',
    startDate: new Date('2025-02-14T09:00:00'),
    endDate: new Date('2025-02-14T18:00:00'),
    dayNumber: 4,
    maxParticipants: 180,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Sherlock Holmes',
    description: 'Mystery solving and detective competition',
    category: categoryMap['Fun Activities'],
    venue: 'Campus Wide',
    building: 'Main Campus',
    startDate: new Date('2025-02-14T10:00:00'),
    endDate: new Date('2025-02-14T15:00:00'),
    dayNumber: 4,
    maxParticipants: 50,
    registrationDeadline: new Date('2025-02-13T23:59:59')
  },
  {
    title: 'Eco 3D Models - Day 2',
    description: 'Eco-friendly 3D model design competition continues',
    category: categoryMap['Engineering'],
    venue: 'Design Studio',
    building: 'Engineering Block',
    startDate: new Date('2025-02-14T09:00:00'),
    endDate: new Date('2025-02-14T15:00:00'),
    dayNumber: 4,
    maxParticipants: 35,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'Spellathon',
    description: 'Spelling bee competition',
    category: categoryMap['Literary'],
    venue: 'Auditorium',
    building: 'Academic Block',
    startDate: new Date('2025-02-14T10:00:00'),
    endDate: new Date('2025-02-14T13:00:00'),
    dayNumber: 4,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-13T23:59:59')
  },
  {
    title: 'DSLR Photography - Day 3',
    description: 'DSLR photography competition continues',
    category: categoryMap['Photography'],
    venue: 'Campus Wide',
    building: 'Main Campus',
    startDate: new Date('2025-02-14T09:00:00'),
    endDate: new Date('2025-02-14T17:00:00'),
    dayNumber: 4,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Mobile Photography - Day 3',
    description: 'Mobile photography competition continues',
    category: categoryMap['Photography'],
    venue: 'Campus Wide',
    building: 'Main Campus',
    startDate: new Date('2025-02-14T09:00:00'),
    endDate: new Date('2025-02-14T17:00:00'),
    dayNumber: 4,
    maxParticipants: 60,
    registrationDeadline: new Date('2025-02-11T23:59:59')
  },
  {
    title: 'Tug of War',
    description: 'Team tug of war competition',
    category: categoryMap['Sports'],
    venue: 'Sports Ground',
    building: 'Sports Complex',
    startDate: new Date('2025-02-14T11:00:00'),
    endDate: new Date('2025-02-14T15:00:00'),
    dayNumber: 4,
    maxParticipants: 80,
    registrationDeadline: new Date('2025-02-13T23:59:59')
  },
  {
    title: 'Line Follower Robots',
    description: 'Autonomous line follower robot competition',
    category: categoryMap['Engineering'],
    venue: 'Robotics Lab',
    building: 'Engineering Block',
    startDate: new Date('2025-02-14T10:00:00'),
    endDate: new Date('2025-02-14T15:00:00'),
    dayNumber: 4,
    maxParticipants: 30,
    registrationDeadline: new Date('2025-02-13T23:59:59')
  },
  {
    title: 'Arm Wrestling',
    description: 'Arm wrestling competition',
    category: categoryMap['Sports'],
    venue: 'Sports Hall',
    building: 'Sports Complex',
    startDate: new Date('2025-02-14T13:00:00'),
    endDate: new Date('2025-02-14T16:00:00'),
    dayNumber: 4,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-13T23:59:59')
  },
  {
    title: 'Dekh Tamasha - Day 2',
    description: 'Drama and theatrical performance continues',
    category: categoryMap['Entertainment'],
    venue: 'Open Air Theater',
    building: 'Main Campus',
    startDate: new Date('2025-02-14T10:00:00'),
    endDate: new Date('2025-02-14T16:00:00'),
    dayNumber: 4,
    maxParticipants: 50,
    registrationDeadline: new Date('2025-02-12T23:59:59')
  },
  {
    title: 'PUBG',
    description: 'PUBG Mobile gaming tournament',
    category: categoryMap['Gaming'],
    venue: 'Gaming Arena',
    building: 'Sports Complex',
    startDate: new Date('2025-02-14T10:00:00'),
    endDate: new Date('2025-02-14T17:00:00'),
    dayNumber: 4,
    maxParticipants: 100,
    registrationDeadline: new Date('2025-02-13T23:59:59')
  },
  {
    title: 'Marketing Mayhem',
    description: 'Marketing strategy and campaign competition',
    category: categoryMap['Business'],
    venue: 'Business Lab',
    building: 'Business Block',
    startDate: new Date('2025-02-14T09:00:00'),
    endDate: new Date('2025-02-14T15:00:00'),
    dayNumber: 4,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-13T23:59:59')
  },
  {
    title: 'Web Development Hackathon',
    description: '24-hour web development hackathon',
    category: categoryMap['Technology'],
    venue: 'Computer Lab 3',
    building: 'Technology Block',
    startDate: new Date('2025-02-14T09:00:00'),
    endDate: new Date('2025-02-14T18:00:00'),
    dayNumber: 4,
    maxParticipants: 60,
    registrationDeadline: new Date('2025-02-13T23:59:59')
  },
  {
    title: 'RC Cars',
    description: 'Remote control car racing competition',
    category: categoryMap['Engineering'],
    venue: 'Open Field',
    building: 'Sports Complex',
    startDate: new Date('2025-02-14T14:00:00'),
    endDate: new Date('2025-02-14T17:00:00'),
    dayNumber: 4,
    maxParticipants: 25,
    registrationDeadline: new Date('2025-02-13T23:59:59')
  },

  // DAY 5 - February 15, 2025
  {
    title: 'Minute to Win It',
    description: 'Fast-paced one-minute challenge games',
    category: categoryMap['Fun Activities'],
    venue: 'Sports Hall',
    building: 'Sports Complex',
    startDate: new Date('2025-02-15T09:00:00'),
    endDate: new Date('2025-02-15T13:00:00'),
    dayNumber: 5,
    maxParticipants: 100,
    registrationDeadline: new Date('2025-02-14T23:59:59')
  },
  {
    title: 'The TAAKRA Reel',
    description: 'Short video reel making competition',
    category: categoryMap['Photography'],
    venue: 'Media Lab',
    building: 'Technology Block',
    startDate: new Date('2025-02-15T10:00:00'),
    endDate: new Date('2025-02-15T14:00:00'),
    dayNumber: 5,
    maxParticipants: 50,
    registrationDeadline: new Date('2025-02-14T23:59:59')
  },
  {
    title: 'VLOG',
    description: 'Video blogging and vlogging competition',
    category: categoryMap['Photography'],
    venue: 'Campus Wide',
    building: 'Main Campus',
    startDate: new Date('2025-02-15T09:00:00'),
    endDate: new Date('2025-02-15T15:00:00'),
    dayNumber: 5,
    maxParticipants: 40,
    registrationDeadline: new Date('2025-02-14T23:59:59')
  },
  {
    title: 'Squid Games',
    description: 'Squid Game inspired challenge event',
    category: categoryMap['Fun Activities'],
    venue: 'Sports Complex',
    building: 'Sports Complex',
    startDate: new Date('2025-02-15T14:00:00'),
    endDate: new Date('2025-02-15T18:00:00'),
    dayNumber: 5,
    maxParticipants: 200,
    registrationDeadline: new Date('2025-02-14T23:59:59')
  }
];

// Main seed function
const seedDatabase = async () => {
  try {
    logger.info('Starting database seed process...');

    // Connect to database
    await connectDB();
    logger.info('Database connected successfully');

    // Clear existing data
    logger.info('Clearing existing data...');
    await Category.deleteMany({});
    await Competition.deleteMany({});
    await User.deleteMany({});
    logger.info('Existing data cleared');

    // Insert categories
    logger.info('Inserting categories...');
    const insertedCategories = await Category.insertMany(categories);
    logger.info(`${insertedCategories.length} categories inserted successfully`);

    // Create category mapping
    const categoryMap = {};
    insertedCategories.forEach(category => {
      categoryMap[category.name] = category._id;
    });

    // Insert competitions
    logger.info('Inserting competitions...');
    const competitions = getCompetitions(categoryMap);
    const insertedCompetitions = await Competition.insertMany(competitions);
    logger.info(`${insertedCompetitions.length} competitions inserted successfully`);

    // Insert sample users
    logger.info('Inserting sample users...');
    const insertedUsers = await User.create(users);
    logger.info(`${insertedUsers.length} users inserted successfully`);

    // Log success message with credentials
    logger.info('\n==============================================');
    logger.info('DATABASE SEEDED SUCCESSFULLY!');
    logger.info('==============================================');
    logger.info('\nSample User Credentials:');
    logger.info('------------------------');
    logger.info('Admin User:');
    logger.info('  Email: admin@taakra.com');
    logger.info('  Password: 123456');
    logger.info('  Role: admin');
    logger.info('\nSupport User:');
    logger.info('  Email: support@taakra.com');
    logger.info('  Password: 123456');
    logger.info('  Role: support');
    logger.info('\nRegular User:');
    logger.info('  Email: user@taakra.com');
    logger.info('  Password: 123456');
    logger.info('  Role: user');
    logger.info('\n==============================================');
    logger.info(`Total Categories: ${insertedCategories.length}`);
    logger.info(`Total Competitions: ${insertedCompetitions.length}`);
    logger.info(`Total Users: ${insertedUsers.length}`);
    logger.info('==============================================\n');

    // Exit process
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
