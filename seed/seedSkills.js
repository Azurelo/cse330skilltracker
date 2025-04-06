const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Skill = require('../models/Skill');

dotenv.config();

const seedSkills = [
  { name: 'Drawing', category: 'Art', icon: 'https://cdn.pixabay.com/photo/2018/04/05/16/25/mikado-3293281_640.jpg' },
  { name: 'Cooking', category: 'Life', icon: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_640.jpg' },
  { name: 'JavaScript', category: 'Tech', icon: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg' },
  { name: 'Swimming', category: 'Sports', icon: 'https://cdn.pixabay.com/photo/2017/04/08/10/23/surfing-2212948_640.jpg' },
  { name: 'Time Management', category: 'Self-Improvement', icon: 'https://cdn.pixabay.com/photo/2019/06/18/07/09/school-4281626_640.jpg' },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Skill.deleteMany();
    await Skill.insertMany(seedSkills);
    console.log('Seeded skills successfully');
    process.exit();
  })
  .catch(err => console.error('Seeding error:', err));
