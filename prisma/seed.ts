import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const dbUrl = process.env.DATABASE_URL || './database/db.db';
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting seed...');

    // Clear existing data
    await prisma.message.deleteMany();
    await prisma.userChat.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.user.deleteMany();
    await prisma.image.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Generate Images (Profile Pictures)
    const imageCount = 50;
    const images = [];
    for (let i = 0; i < imageCount; i++) {
        const image = await prisma.image.create({
            data: {
                url: faker.image.avatar(),
            },
        });
        images.push(image);
    }
    console.log(`✅ Created ${images.length} images`);

    // Generate Users
    const userCount = 30;
    const users = [];
    const defaultPassword = await bcrypt.hash('password123', 10);

    for (let i = 0; i < userCount; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email().toLowerCase(),
                userName: faker.internet.username().toLowerCase(),
                bio: faker.person.bio(),
                password: defaultPassword,
                lastSeen: faker.date.recent({ days: 7 }),
                profilePictureId: faker.helpers.arrayElement(images).id,
            },
        });
        users.push(user);
    }
    console.log(`✅ Created ${users.length} users`);

    // Generate Chats (1-on-1 chats between random users)
    const chatCount = 40;
    const chats = [];

    for (let i = 0; i < chatCount; i++) {
        // Pick 2 random users for each chat
        const [user1, user2] = faker.helpers.arrayElements(users, 2);

        const chat = await prisma.chat.create({
            data: {
                participants: {
                    create: [
                        { userId: user1.id },
                        { userId: user2.id },
                    ],
                },
            },
        });
        chats.push({ chat, users: [user1, user2] });
    }
    console.log(`✅ Created ${chats.length} chats`);

    // Generate Messages for each chat
    let totalMessages = 0;
    for (const { chat, users: chatUsers } of chats) {
        // Each chat gets 200-250 messages, alternating between both users
        const messageCount = faker.number.int({ min: 200, max: 250 });
        const [userA, userB] = chatUsers;
        const startIndex = faker.number.int({ min: 0, max: 1 });
        let messageTime = faker.date.recent({ days: 30 });

        for (let i = 0; i < messageCount; i++) {
            const sender = (i + startIndex) % 2 === 0 ? userA : userB;
            // Increment time to keep ordering realistic
            messageTime = new Date(
                messageTime.getTime() +
                    faker.number.int({ min: 1, max: 120 }) * 60 * 1000
            );

            await prisma.message.create({
                data: {
                    text: faker.lorem.sentence({ min: 3, max: 15 }),
                    senderId: sender.id,
                    chatId: chat.id,
                    createdAt: messageTime,
                },
            });
            totalMessages++;
        }
    }
    console.log(`✅ Created ${totalMessages} messages`);

    console.log('🎉 Seed completed successfully!');
    console.log(`\nSummary:`);
    console.log(`  - ${images.length} images`);
    console.log(`  - ${users.length} users`);
    console.log(`  - ${chats.length} chats`);
    console.log(`  - ${totalMessages} messages`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

