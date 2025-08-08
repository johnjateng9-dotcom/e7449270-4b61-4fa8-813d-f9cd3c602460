import { db } from '../server/db';
import { users, teams, projects, tasks, channels, messages } from '../shared/schema';
import { authService } from '../server/auth';

async function seed() {
  console.log('Starting database seeding...');

  try {
    // Create sample users
    console.log('Creating sample users...');
    
    const user1 = await authService.register({
      email: 'admin@collabflow.com',
      password: 'admin123',
      confirmPassword: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    const user2 = await authService.register({
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user'
    });

    const user3 = await authService.register({
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'user'
    });

    console.log('✅ Users created successfully');

    // Create sample teams
    console.log('Creating sample teams...');
    
    const [team1] = await db.insert(teams).values({
      name: 'Design Team',
      slug: 'design-team',
      description: 'User experience and visual design team',
      ownerId: user1.user.id,
      subscriptionPlan: 'pro'
    }).returning();

    const [team2] = await db.insert(teams).values({
      name: 'Development Team',
      slug: 'dev-team',
      description: 'Frontend and backend development team',
      ownerId: user2.user.id,
      subscriptionPlan: 'enterprise'
    }).returning();

    console.log('✅ Teams created successfully');

    // Create sample projects
    console.log('Creating sample projects...');
    
    const [project1] = await db.insert(projects).values({
      name: 'CollabFlow Platform',
      description: 'Main platform development project',
      status: 'active',
      priority: 'high',
      teamId: team2.id,
      ownerId: user2.user.id,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-06-30')
    }).returning();

    const [project2] = await db.insert(projects).values({
      name: 'Brand Identity',
      description: 'Complete brand identity and design system',
      status: 'active',
      priority: 'medium',
      teamId: team1.id,
      ownerId: user1.user.id,
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-03-15')
    }).returning();

    console.log('✅ Projects created successfully');

    // Create sample tasks
    console.log('Creating sample tasks...');
    
    const sampleTasks = [
      {
        title: 'Setup Authentication System',
        description: 'Implement JWT-based authentication with bcrypt password hashing',
        status: 'done',
        priority: 'high',
        projectId: project1.id,
        assigneeId: user2.user.id,
        creatorId: user1.user.id,
        position: 1
      },
      {
        title: 'Create Database Schema',
        description: 'Design and implement comprehensive database schema for all features',
        status: 'done',
        priority: 'high',
        projectId: project1.id,
        assigneeId: user2.user.id,
        creatorId: user1.user.id,
        position: 2
      },
      {
        title: 'Build REST API',
        description: 'Develop REST API endpoints for all core functionality',
        status: 'in_progress',
        priority: 'high',
        projectId: project1.id,
        assigneeId: user2.user.id,
        creatorId: user1.user.id,
        position: 3
      },
      {
        title: 'Implement Real-time Features',
        description: 'Add WebSocket support for real-time collaboration',
        status: 'todo',
        priority: 'medium',
        projectId: project1.id,
        assigneeId: user3.user.id,
        creatorId: user1.user.id,
        position: 4
      },
      {
        title: 'Design Logo and Branding',
        description: 'Create primary logo and brand guidelines',
        status: 'in_progress',
        priority: 'high',
        projectId: project2.id,
        assigneeId: user1.user.id,
        creatorId: user1.user.id,
        position: 1
      },
      {
        title: 'Create Color Palette',
        description: 'Develop consistent color system for the platform',
        status: 'done',
        priority: 'medium',
        projectId: project2.id,
        assigneeId: user1.user.id,
        creatorId: user1.user.id,
        position: 2
      }
    ];

    await db.insert(tasks).values(sampleTasks);
    console.log('✅ Tasks created successfully');

    // Create sample channels
    console.log('Creating sample channels...');
    
    const [channel1] = await db.insert(channels).values({
      name: 'general',
      description: 'General team discussions',
      type: 'public',
      teamId: team1.id,
      creatorId: user1.user.id
    }).returning();

    const [channel2] = await db.insert(channels).values({
      name: 'development',
      description: 'Development team discussions',
      type: 'public',
      teamId: team2.id,
      creatorId: user2.user.id
    }).returning();

    const [channel3] = await db.insert(channels).values({
      name: 'project-updates',
      description: 'Project status and updates',
      type: 'public',
      teamId: team2.id,
      projectId: project1.id,
      creatorId: user1.user.id
    }).returning();

    console.log('✅ Channels created successfully');

    // Create sample messages
    console.log('Creating sample messages...');
    
    const sampleMessages = [
      {
        content: 'Welcome to the Design Team channel! 🎨',
        type: 'text',
        channelId: channel1.id,
        userId: user1.user.id
      },
      {
        content: 'Great progress on the authentication system!',
        type: 'text',
        channelId: channel2.id,
        userId: user2.user.id
      },
      {
        content: 'The database schema has been successfully implemented with all required tables.',
        type: 'text',
        channelId: channel3.id,
        userId: user1.user.id
      },
      {
        content: 'Starting work on the REST API endpoints today.',
        type: 'text',
        channelId: channel3.id,
        userId: user2.user.id
      }
    ];

    await db.insert(messages).values(sampleMessages);
    console.log('✅ Messages created successfully');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nSample accounts created:');
    console.log('- admin@collabflow.com / admin123 (Admin)');
    console.log('- john@example.com / password123 (User)');
    console.log('- jane@example.com / password123 (User)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function directly
seed()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });

export default seed;