docker exec -it backend-mongodb mongosh -u admin -p a
dmin123


test> use multimedia_db

multimedia_db> show collections
gamescores
levels
users
multimedia_db> show dbs
admin          100.00 KiB
config          72.00 KiB
local           72.00 KiB
multimedia_db  268.00 KiB
multimedia_db> show users
[]
multimedia_db> db.users.find().limit(5).pretty()
[
  {
    _id: ObjectId('6914ee35ed96040756f18463'),
    email: 'julian@prueba.com',
    password: '$2a$10$lCcyvlbKpY9UULFkV3nM5ukqG1fKQjBJ7RuLc.l75NveYlWShQVSy',
    name: '',
    createdAt: ISODate('2025-11-12T20:29:41.623Z'),
    updatedAt: ISODate('2025-11-12T20:29:41.623Z'),
    __v: 0
  },
  {
    _id: ObjectId('691519c59997bae9484acab7'),
    email: 'test@test.com',
    password: '$2a$10$.3Y6UdBUpt58eDpKs7vTi.4u6f9RNDTbMszTsr2jIf4xJeG.WOg9m',
    name: 'Usuario Test',
    createdAt: ISODate('2025-11-12T23:35:33.750Z'),
    updatedAt: ISODate('2025-11-12T23:35:33.750Z'),
    __v: 0
  }
]
multimedia_db> db.gamescores.find().limit(5).pretty()
[
  {
    _id: ObjectId('691519c59997bae9484acaba'),
    user: ObjectId('691519c59997bae9484acab7'),
    totalPoints: 150,
    pointsByLevel: { level1: 50, level2: 60, level3: 40 },
    gameTime: 1200.5,
    completedAt: ISODate('2025-11-12T23:35:33.849Z'),
    createdAt: ISODate('2025-11-12T23:35:33.850Z'),
    updatedAt: ISODate('2025-11-12T23:35:33.850Z'),
    __v: 0
  }
]