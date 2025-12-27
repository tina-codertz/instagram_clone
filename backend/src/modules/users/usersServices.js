import prisma from '../../config/db.js';

export const getUsers = async (search) => {
  return prisma.user.findMany({
    where: search ? { username: { contains: search, mode: 'insensitive' } } : {},
    select: { id: true, username: true, bio: true, profilePic: true },
  });
};

export const getProfile = async (id) => {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) throw new Error('Invalid user ID');

  const user = await prisma.user.findUnique({
    where: { id: parsedId },
    select: { id: true, username: true, bio: true, profilePic: true },
  });

  if (!user) throw new Error('User not found');

  const [postCount, followerCount, followingCount, posts] = await Promise.all([
    prisma.post.count({ where: { userId: parsedId } }),
    prisma.follow.count({ where: { followingId: parsedId } }),
    prisma.follow.count({ where: { followerId: parsedId } }),
    prisma.post.findMany({
      where: { userId: parsedId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, image: true, caption: true, createdAt: true }, // limit fields
      take: 20, // optional: limit posts shown
    }),
  ]);

  return {
    ...user,
    postCount,
    followerCount,
    followingCount,
    posts,
  };
};

export const follow = async (followerId, followingId) => {
  if (followerId === followingId) throw new Error('Cannot follow self');
  const existing = await prisma.follow.findUnique({ where: { followerId_followingId: { followerId, followingId } } });
  if (existing) throw new Error('Already following');
  await prisma.follow.create({ data: { followerId, followingId } });
};

export const unfollow = async (followerId, followingId) => {
  await prisma.follow.deleteMany({ where: { followerId, followingId } });
};

export const getAccountInfo = async (id) => {
  if (!id) throw new Error('User ID is required');

  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: { 
      id: true, 
      username: true, 
      email: true, 
      bio: true, 
      profilePic: true, 
      createdAt: true 
    },
  });

  if (!user) throw new Error('User not found');

  return user;
};

